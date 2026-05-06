/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import QRCode from 'qrcode';
import type {
  SellerOrderDetailResponse,
  SellerOrderMutationResponse,
  SellerOrderNextAction,
  SellerOrderQueueResponse,
  SellerOrderStatus,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentSeller } from '../auth/current-user';

const SELLER_VISIBLE_STATUSES = [
  'PENDING_SELLER_REVIEW',
  'CONFIRMED',
  'IN_FULFILLMENT',
  'READY_FOR_HUB_HANDOFF',
  'HUB_RECEIVED',
  'SORTING',
  'READY_FOR_DISPATCH',
  'READY_FOR_BUYER_HANDOFF',
] as const;

@Injectable()
export class SellerOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getSellerOrders(
    authorization?: string,
  ): Promise<SellerOrderQueueResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const [lines, groupBuys] = await Promise.all([
      this.prisma.orderLine.findMany({
        where: {
          supplyLot: { sellerId: seller.id },
          order: { status: { in: [...SELLER_VISIBLE_STATUSES] } },
        },
        include: {
          order: {
            include: { buyer: true, sellerHandoff: { include: { hub: true } } },
          },
          supplyLot: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.groupBuy.findMany({
        where: { status: 'LIVE', supplyLot: { sellerId: seller.id } },
        include: {
          product: true,
          supplyLot: true,
          _count: { select: { commitments: true } },
        },
        orderBy: { deadlineAt: 'asc' },
      }),
    ]);
    const orders = lines.map((line) => this.toSellerOrder(line));
    return {
      summary: {
        incoming: orders.filter((o) => o.status === 'incoming').length,
        active: orders.filter((o) =>
          [
            'accepted',
            'packed',
            'handoff_ready',
            'hub_received',
            'sorting',
          ].includes(o.status),
        ).length,
        ready: orders.filter((o) => o.status === 'ready').length,
        groupProgress: groupBuys.length,
      },
      orders,
      groupProgress: groupBuys.map((group) => ({
        id: group.code,
        supplyLotId: group.supplyLotId,
        title: `${group.product.name} group buy`,
        committedQty: group.committedQty,
        targetQty: group.targetQty,
        percent: group.targetQty
          ? Math.min(
              100,
              Math.round((group.committedQty / group.targetQty) * 100),
            )
          : 0,
        unit: group.supplyLot.unit,
        deadlineLabel: group.deadlineAt.toLocaleDateString('en-BD'),
        buyerCount: group._count.commitments,
      })),
    };
  }

  async getSellerOrder(
    authorization: string | undefined,
    orderId: string,
  ): Promise<SellerOrderDetailResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
      include: {
        order: {
          include: {
            buyer: true,
            sellerHandoff: { include: { hub: true } },
            events: { orderBy: { createdAt: 'asc' } },
          },
        },
        supplyLot: { include: { product: true } },
      },
    });
    if (!line) throw new NotFoundException('Order not found');
    if (line.supplyLot.sellerId !== seller.id)
      throw new ForbiddenException('Not your order');
    if (!SELLER_VISIBLE_STATUSES.includes(line.order.status as any))
      throw new NotFoundException('Order not found');
    return {
      order: {
        ...this.toSellerOrder(line),
        unitPriceLabel: this.formatBdt(line.unitPrice),
        handoff: this.toHandoff(line.order.sellerHandoff),
        trackingEvents: this.toEvents(line.order.events, line.order.status),
      },
    };
  }

  async getHandoffLabel(
    authorization: string | undefined,
    orderId: string,
  ): Promise<string> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (!line.order.sellerHandoff)
      throw new NotFoundException('Handoff label is not generated yet');
    const handoff = line.order.sellerHandoff;
    const qrSvg = await this.makeQrSvg(handoff.qrPayload, 240);
    return this.buildHandoffHtml({
      qrSvg,
      handoffCode: handoff.handoffCode,
      sealCode: handoff.sealCode,
      hubName: handoff.hub?.name ?? 'Bogura Regional Hub',
      hubDistrict: handoff.hub?.district ?? 'Bogura',
      orderCode: line.order.code,
      buyerName: line.order.buyer.fullName,
      productName: line.supplyLot.product.name,
      quantityLabel: `${line.quantity} ${line.supplyLot.unit}`,
      packageLabel: line.supplyLot.packageLabel,
    });
  }

  async getHandoffQr(
    authorization: string | undefined,
    orderId: string,
  ): Promise<string> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (!line.order.sellerHandoff)
      throw new NotFoundException('Handoff label is not generated yet');
    return this.makeQrSvg(line.order.sellerHandoff.qrPayload, 192);
  }

  async acceptSellerOrder(
    authorization: string | undefined,
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (line.order.status !== 'PENDING_SELLER_REVIEW')
      throw new NotFoundException('Order not ready for seller acceptance');
    const hub = await this.prisma.hub.findFirst({
      orderBy: { createdAt: 'asc' },
    });
    const handoff = this.makeHandoff(line);
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: line.orderId },
        data: { status: 'CONFIRMED' },
      }),
      this.prisma.sellerHandoff.upsert({
        where: { orderId: line.orderId },
        update: {},
        create: { orderId: line.orderId, hubId: hub?.id, ...handoff },
      }),
      this.prisma.orderEvent.create({
        data: {
          orderId: line.orderId,
          actorRole: 'SELLER',
          eventType: 'SELLER_ACCEPTED',
          fromStatus: line.order.status,
          toStatus: 'CONFIRMED',
          message:
            'Seller accepted the order. Prepare QR label and sealed hub handoff.',
        },
      }),
    ]);
    return {
      ...(await this.getSellerOrder(authorization, orderId)),
      message: 'Order accepted. Print the hub label and seal the package.',
    };
  }

  async printHandoffLabel(
    authorization: string | undefined,
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (
      !['CONFIRMED', 'IN_FULFILLMENT', 'READY_FOR_HUB_HANDOFF'].includes(
        line.order.status,
      )
    ) {
      throw new NotFoundException('Order is not ready for handoff label');
    }
    await this.ensureHandoff(line);
    await this.prisma.$transaction([
      this.prisma.sellerHandoff.update({
        where: { orderId: line.orderId },
        data: { labelPrintedAt: new Date(), status: 'LABEL_PRINTED' },
      }),
      this.prisma.orderEvent.create({
        data: {
          orderId: line.orderId,
          actorRole: 'SELLER',
          eventType: 'HANDOFF_LABEL_PRINTED',
          fromStatus: line.order.status,
          toStatus: line.order.status,
          message:
            'QR handoff label printed. Apply the seal code before sending to hub.',
        },
      }),
    ]);
    return {
      ...(await this.getSellerOrder(authorization, orderId)),
      message: 'Handoff label printed',
    };
  }

  async packSellerOrder(
    authorization: string | undefined,
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (line.order.status !== 'CONFIRMED')
      throw new NotFoundException('Order not ready to pack');
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: line.orderId },
        data: { status: 'IN_FULFILLMENT' },
      }),
      this.prisma.orderEvent.create({
        data: {
          orderId: line.orderId,
          actorRole: 'SELLER',
          eventType: 'SELLER_PREPARING',
          fromStatus: line.order.status,
          toStatus: 'IN_FULFILLMENT',
          message: 'Seller started packing and quality check for hub handoff.',
        },
      }),
    ]);
    return {
      ...(await this.getSellerOrder(authorization, orderId)),
      message: 'Order packed',
    };
  }

  async readySellerOrder(
    authorization: string | undefined,
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.getOwnedLine(authorization, orderId);
    if (!['CONFIRMED', 'IN_FULFILLMENT'].includes(line.order.status))
      throw new NotFoundException('Order not ready for hub handoff');
    await this.ensureHandoff(line);
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: line.orderId },
        data: { status: 'READY_FOR_HUB_HANDOFF' },
      }),
      this.prisma.sellerHandoff.update({
        where: { orderId: line.orderId },
        data: {
          status: 'READY_FOR_HUB',
          labelPrintedAt:
            line.order.sellerHandoff?.labelPrintedAt ?? new Date(),
          sellerReadyAt: new Date(),
        },
      }),
      this.prisma.orderEvent.create({
        data: {
          orderId: line.orderId,
          actorRole: 'SELLER',
          eventType: 'READY_FOR_HUB_HANDOFF',
          fromStatus: line.order.status,
          toStatus: 'READY_FOR_HUB_HANDOFF',
          message: 'Seller marked the sealed package ready for hub receiving.',
        },
      }),
    ]);
    return {
      ...(await this.getSellerOrder(authorization, orderId)),
      message: 'Order ready for hub handoff',
    };
  }

  private async getOwnedLine(
    authorization: string | undefined,
    orderId: string,
  ) {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
      include: {
        order: {
          include: { buyer: true, sellerHandoff: { include: { hub: true } } },
        },
        supplyLot: { include: { product: true } },
      },
    });
    if (!line) throw new NotFoundException('Order not found');
    if (line.supplyLot.sellerId !== seller.id)
      throw new ForbiddenException('Not your order');
    return line;
  }

  private toSellerOrder(line: any) {
    const mapped = this.mapStatus(line.order.status, line.order.sellerHandoff);
    return {
      id: line.id,
      buyerName: line.order.buyer.fullName,
      quantityLabel: `${line.quantity} ${line.supplyLot.unit}`,
      dueLabel: line.order.sellerHandoff?.hub?.name ?? 'Hub assignment pending',
      status: mapped.status,
      nextAction: mapped.nextAction,
      orderType: line.order.orderType,
      paymentStatus: line.order.paymentStatus,
      totalLabel: this.formatBdt(line.order.total),
      productName: line.supplyLot.product.name,
      productImageUrl: line.supplyLot.product.imageUrl || undefined,
      hubName: line.order.sellerHandoff?.hub?.name ?? 'Bogura hub handoff',
      items: [
        {
          name: line.supplyLot.product.name,
          quantityLabel: `${line.quantity} ${line.supplyLot.unit}`,
          packageLabel: line.supplyLot.packageLabel,
        },
      ],
      pickupWindow: line.order.sellerHandoff?.hub
        ? `${line.order.sellerHandoff.hub.name}, ${line.order.sellerHandoff.hub.district}`
        : 'Hub assignment pending',
      notes: [this.statusNote(line.order.status, line.order.orderType)],
    };
  }

  private mapStatus(
    status: string,
    handoff?: any,
  ): { status: SellerOrderStatus; nextAction: SellerOrderNextAction } {
    if (status === 'PENDING_SELLER_REVIEW')
      return { status: 'incoming', nextAction: 'accept' };
    if (status === 'CONFIRMED')
      return {
        status: 'accepted',
        nextAction: handoff?.labelPrintedAt ? 'ready_for_hub' : 'print_label',
      };
    if (status === 'IN_FULFILLMENT')
      return { status: 'packed', nextAction: 'ready_for_hub' };
    if (status === 'READY_FOR_HUB_HANDOFF')
      return { status: 'handoff_ready', nextAction: 'none' };
    if (status === 'HUB_RECEIVED')
      return { status: 'hub_received', nextAction: 'none' };
    if (status === 'SORTING') return { status: 'sorting', nextAction: 'none' };
    return { status: 'ready', nextAction: 'none' };
  }

  private statusNote(status: string, orderType: string): string {
    if (status === 'PENDING_SELLER_REVIEW')
      return orderType === 'GROUP'
        ? 'Group target is locked. Seller acceptance is now required.'
        : 'Single-buy order is waiting for seller acceptance.';
    if (status === 'CONFIRMED')
      return 'Print the hub label, apply the seal, then send to hub.';
    if (status === 'READY_FOR_HUB_HANDOFF')
      return 'Package is ready. Hub will verify QR and seal at receiving.';
    if (status === 'HUB_RECEIVED')
      return 'Hub received the package and confirmed the handoff.';
    return 'Track the operational status until buyer handoff is complete.';
  }

  private toHandoff(handoff?: any) {
    if (!handoff) return undefined;
    return {
      handoffCode: handoff.handoffCode,
      qrPayload: handoff.qrPayload,
      sealCode: handoff.sealCode,
      status: handoff.status,
      hubName: handoff.hub?.name ?? 'Bogura Regional Hub',
      hubDistrict: handoff.hub?.district ?? 'Bogura',
      labelPrintedAt: handoff.labelPrintedAt?.toISOString(),
      sellerReadyAt: handoff.sellerReadyAt?.toISOString(),
      hubReceivedAt: handoff.hubReceivedAt?.toISOString(),
      discrepancyNotes: handoff.discrepancyNotes ?? undefined,
    };
  }

  private toEvents(events: any[] = [], orderStatus: string) {
    const mapped = events.map((event) => ({
      id: event.id,
      eventType: event.eventType,
      label: this.eventLabel(event.eventType),
      message: event.message,
      actorRole: event.actorRole,
      createdAt: event.createdAt.toISOString(),
      status: 'done' as const,
    }));
    const current = this.currentEvent(orderStatus);
    return current ? [...mapped, current] : mapped;
  }

  private currentEvent(orderStatus: string) {
    if (orderStatus === 'PENDING_SELLER_REVIEW') {
      return {
        id: 'current-review',
        eventType: 'WAITING_SELLER',
        label: 'Waiting for seller review',
        message: 'Accept the order to create the hub QR and seal.',
        actorRole: 'SELLER' as const,
        createdAt: new Date().toISOString(),
        status: 'current' as const,
      };
    }
    if (orderStatus === 'READY_FOR_HUB_HANDOFF') {
      return {
        id: 'current-hub',
        eventType: 'WAITING_HUB_SCAN',
        label: 'Waiting for hub scan',
        message:
          'Send the sealed package to the assigned hub for QR and seal verification.',
        actorRole: 'HUB_MANAGER' as const,
        createdAt: new Date().toISOString(),
        status: 'current' as const,
      };
    }
    return undefined;
  }

  private eventLabel(type: string): string {
    return (
      (
        {
          SELLER_ACCEPTED: 'Seller accepted',
          HANDOFF_LABEL_PRINTED: 'QR label printed',
          SELLER_PREPARING: 'Seller preparing',
          READY_FOR_HUB_HANDOFF: 'Ready for hub',
          HUB_RECEIVED: 'Hub received',
          HUB_DISCREPANCY: 'Hub exception',
        } as Record<string, string>
      )[type] ?? type
    );
  }

  private async ensureHandoff(line: any) {
    if (line.order.sellerHandoff) return;
    await this.prisma.sellerHandoff.create({
      data: { orderId: line.orderId, ...this.makeHandoff(line) },
    });
  }

  private makeHandoff(line: any) {
    const handoffCode = this.buildCode('FH-HO', line.id);
    const sealCode = this.buildCode('SEAL', line.id);
    return {
      handoffCode,
      sealCode,
      qrPayload: JSON.stringify({
        type: 'FOSHOLHAAT_SELLER_HANDOFF',
        orderId: line.orderId,
        orderCode: line.order.code,
        handoffCode,
        sealCode,
      }),
    };
  }

  private buildCode(prefix: string, source: string): string {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${source.slice(-5).toUpperCase()}`;
  }

  private makeQrSvg(payload: string, width: number): Promise<string> {
    return QRCode.toString(payload, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      width,
    });
  }

  private buildHandoffHtml(data: Record<string, string>): string {
    const e = (value: string) =>
      value.replace(
        /[&<>"']/g,
        (char) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[char] ?? char,
      );
    return `<!doctype html><html><head><meta charset="utf-8"><title>FosholHaat Handoff ${e(data.handoffCode)}</title><style>
body{margin:0;background:#f5f8f6;color:#101828;font-family:Arial,sans-serif}.sheet{width:760px;margin:24px auto;background:white;border:1px solid #d9e4dc;border-radius:18px;padding:28px}.top{display:flex;justify-content:space-between;border-bottom:2px solid #0b5a34;padding-bottom:18px}.brand{font-size:28px;font-weight:900;color:#064d2b}.tag{font-size:12px;font-weight:900;letter-spacing:.12em;color:#0b5a34;text-transform:uppercase}.grid{display:grid;grid-template-columns:280px 1fr;gap:24px;margin-top:24px}.qr{border:1px solid #d9e4dc;border-radius:16px;padding:18px;text-align:center}.qr svg{width:240px;height:240px}.box{border:1px solid #d9e4dc;border-radius:14px;padding:14px;margin-bottom:12px}.label{font-size:11px;font-weight:900;color:#667085;letter-spacing:.1em;text-transform:uppercase}.value{margin-top:6px;font-size:20px;font-weight:900}.seal{font-size:26px;color:#0b5a34}.check{margin-top:24px;border-top:1px solid #d9e4dc;padding-top:18px;display:grid;gap:10px}.check div{font-weight:800}.foot{margin-top:22px;background:#e8f5ec;border-radius:12px;padding:14px;color:#064d2b;font-weight:800}@media print{body{background:white}.sheet{margin:0;width:auto;border:0;border-radius:0;box-shadow:none}}</style></head><body><main class="sheet"><section class="top"><div><div class="brand">FosholHaat</div><div class="tag">Seller to hub sealed handoff</div></div><div><div class="label">Order</div><div class="value">${e(data.orderCode)}</div></div></section><section class="grid"><div class="qr">${data.qrSvg}<div class="label">Scan at hub receiving</div></div><div><div class="box"><div class="label">Handoff code</div><div class="value">${e(data.handoffCode)}</div></div><div class="box"><div class="label">Seal code</div><div class="value seal">${e(data.sealCode)}</div></div><div class="box"><div class="label">Hub</div><div class="value">${e(data.hubName)}, ${e(data.hubDistrict)}</div></div><div class="box"><div class="label">Buyer / Lot</div><div class="value">${e(data.buyerName)} · ${e(data.productName)} · ${e(data.quantityLabel)}</div></div><div class="box"><div class="label">Package</div><div class="value">${e(data.packageLabel)}</div></div></div></section><section class="check"><div>□ Quantity checked</div><div>□ Quality checked</div><div>□ Package sealed with seal code above</div><div>□ QR label attached outside package</div></section><div class="foot">Hub must scan QR and verify the physical seal before DWR receipt.</div></main><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`;
  }

  private formatBdt(value: number): string {
    return `BDT ${value.toLocaleString('en-BD')}`;
  }
}
