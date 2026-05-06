import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  BuyerOrderSummary,
  BuyerOrderDetail,
  BuyerOrderTrackingResponse,
  TrackingStep,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentBuyer } from '../auth/current-user';

type OrderForTimeline = {
  orderType: string;
  status: string;
  paymentStatus: string;
  createdAt: Date;
  updatedAt: Date;
  events?: Array<{
    id: string;
    eventType: string;
    message: string;
    createdAt: Date;
  }>;
  buyer?: { business?: { name?: string | null } | null } | null;
};

@Injectable()
export class BuyerOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(authorization?: string): Promise<BuyerOrderSummary[]> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const orders = await this.prisma.order.findMany({
      where: { buyerId: buyer.id },
      include: {
        lines: { include: { supplyLot: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => {
      const itemsText = order.lines
        .map((l) => l.supplyLot.product.name)
        .join(', ');
      return {
        id: order.code,
        status: order.status,
        title: `${order.lines.length} Items: ${itemsText}`.substring(0, 50),
        total: this.formatBdt(order.total),
        estDelivery: 'TBD',
        imageUrl: order.lines[0]?.supplyLot?.product?.imageUrl || '',
        dateGroup: order.createdAt.toLocaleDateString(),
        orderType: order.orderType,
        paymentStatus: order.paymentStatus,
      };
    });
  }

  async getOrderDetail(
    authorization: string | undefined,
    id: string,
  ): Promise<BuyerOrderDetail> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const order = await this.prisma.order.findUnique({
      where: { code: id },
      include: {
        buyer: { include: { business: true } },
        events: { orderBy: { createdAt: 'asc' } },
        lines: {
          include: {
            supplyLot: {
              include: { product: true, seller: true, business: true },
            },
          },
        },
      },
    });
    if (!order || order.buyerId !== buyer.id)
      throw new NotFoundException('Order not found');

    const itemsText = order.lines
      .map((l) => l.supplyLot.product.name)
      .join(', ');
    return {
      id: order.code,
      status: order.status,
      title: `${order.lines.length} Items: ${itemsText}`.substring(0, 50),
      total: this.formatBdt(order.total),
      estDelivery: 'TBD',
      imageUrl: order.lines[0]?.supplyLot?.product?.imageUrl || '',
      dateGroup: order.createdAt.toLocaleDateString(),
      orderType: order.orderType,
      paymentStatus: order.paymentStatus,
      items: order.lines.map((l) => ({
        name: l.supplyLot.product.name,
        quantity: `${l.quantity} ${l.supplyLot.unit}`,
        price: this.formatBdt(l.quantity * l.unitPrice),
        imageUrl: l.supplyLot.product.imageUrl || undefined,
        sellerName: l.sellerName,
        packageLabel: l.supplyLot.packageLabel,
        mode: l.mode,
      })),
      shippingAddress: order.buyer.business?.district ?? 'Not recorded',
      paymentMethod:
        order.paymentStatus === 'AUTHORIZED'
          ? 'Authorized for group buy'
          : order.paymentStatus === 'PAID'
            ? 'Paid'
            : 'Cash on Delivery',
      subtotal: this.formatBdt(order.subtotal),
      deliveryFee: this.formatBdt(order.total - order.subtotal),
      workflow: this.buildTimeline(order),
    };
  }

  async getOrderTracking(
    authorization: string | undefined,
    id: string,
  ): Promise<BuyerOrderTrackingResponse> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const order = await this.prisma.order.findUnique({
      where: { code: id },
      include: {
        lines: { include: { supplyLot: { include: { product: true } } } },
        buyer: { include: { business: true } },
        events: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order || order.buyerId !== buyer.id)
      throw new NotFoundException('Order not found');

    const firstLine = order.lines[0];
    const itemsText = order.lines
      .map(
        (l) => `${l.quantity} ${l.supplyLot.unit}: ${l.supplyLot.product.name}`,
      )
      .join(', ');
    return {
      orderId: id,
      timeline: this.buildTimeline(order),
      snapshot: {
        title: itemsText.substring(0, 60),
        sku: firstLine
          ? `FH-${firstLine.supplyLot.product.category?.substring(0, 3).toUpperCase()}-${firstLine.supplyLotId.substring(0, 4)}`
          : 'N/A',
        total: order.total.toLocaleString('en-BD'),
        deliveryAddress: order.buyer?.business?.district ?? 'Not recorded',
        contactName: order.buyer?.fullName ?? 'Not recorded',
        contactPhone: 'Not recorded',
      },
      logistics: {
        originHub: 'Not assigned',
        destinationHub: order.buyer?.business?.district ?? 'Not assigned',
        truckId: 'Not assigned',
        fleetPartner: 'Not assigned',
        lastPing: 'Not available',
        speed: 'Not available',
      },
    };
  }

  private formatBdt(value: number): string {
    return `BDT ${value.toLocaleString('en-BD')}`;
  }

  private buildTimeline(order: OrderForTimeline): TrackingStep[] {
    const sellerDone = [
      'CONFIRMED',
      'IN_FULFILLMENT',
      'READY_FOR_HUB_HANDOFF',
      'HUB_RECEIVED',
      'SORTING',
      'READY_FOR_DISPATCH',
      'READY_FOR_BUYER_HANDOFF',
      'COMPLETED',
    ].includes(order.status);
    const handoffReady = [
      'READY_FOR_HUB_HANDOFF',
      'HUB_RECEIVED',
      'SORTING',
      'READY_FOR_DISPATCH',
      'READY_FOR_BUYER_HANDOFF',
      'COMPLETED',
    ].includes(order.status);
    const hubReceived = [
      'HUB_RECEIVED',
      'SORTING',
      'READY_FOR_DISPATCH',
      'READY_FOR_BUYER_HANDOFF',
      'COMPLETED',
    ].includes(order.status);
    const complete = order.status === 'COMPLETED';
    const groupPending =
      order.orderType === 'GROUP' && order.status === 'PENDING_GROUP_LOCK';

    if (groupPending) {
      return [
        {
          key: 'GROUP_ORDER_PLACED',
          label: 'Group order placed',
          occurredAt: order.createdAt.toISOString(),
          status: 'done',
          description: 'Your quantity is committed and payment is authorized.',
        },
        {
          key: 'GROUP_TARGET_PENDING',
          label: 'Waiting for group target',
          status: 'current',
          description:
            'This order stays pending and is not sent to the seller until the group target is filled.',
        },
        {
          key: 'SELLER_CONFIRMATION',
          label: 'Seller confirmation',
          status: 'upcoming',
          description:
            'After target lock, the seller receives the order for acceptance.',
        },
        {
          key: 'HUB_RECEIPT',
          label: 'Hub receipt and buyer handoff',
          status: 'upcoming',
          description:
            'Hub receiving and pickup or delivery details appear after seller handoff.',
        },
      ];
    }

    return [
      {
        key: 'ORDER_PLACED',
        label: 'Order placed',
        occurredAt: order.createdAt.toISOString(),
        status: 'done',
        description:
          order.orderType === 'GROUP'
            ? 'Group target is locked. The order is waiting for seller review.'
            : 'Order has been sent to the seller for confirmation.',
      },
      {
        key: 'SELLER_CONFIRMATION',
        label: sellerDone
          ? 'Seller accepted order'
          : 'Waiting for seller confirmation',
        occurredAt: sellerDone ? order.updatedAt.toISOString() : undefined,
        status: sellerDone ? 'done' : 'current',
        description: sellerDone
          ? 'Seller accepted the order and is preparing hub handoff.'
          : 'No seller acceptance has been recorded yet.',
      },
      {
        key: 'HUB_RECEIPT',
        label: handoffReady
          ? hubReceived
            ? 'Hub received package'
            : 'Ready for hub receiving'
          : 'Seller to hub handoff',
        occurredAt: handoffReady ? order.updatedAt.toISOString() : undefined,
        status: hubReceived ? 'done' : handoffReady ? 'current' : 'upcoming',
        description: hubReceived
          ? 'Hub scanned the QR label and verified the seller seal.'
          : handoffReady
            ? 'Seller marked the sealed package ready for hub intake.'
            : 'The hub step starts after seller acceptance and handoff.',
      },
      {
        key: 'HUB_SORTING',
        label: [
          'SORTING',
          'READY_FOR_DISPATCH',
          'READY_FOR_BUYER_HANDOFF',
          'COMPLETED',
        ].includes(order.status)
          ? 'Sorting and dispatch prep'
          : 'Hub sorting',
        occurredAt: [
          'SORTING',
          'READY_FOR_DISPATCH',
          'READY_FOR_BUYER_HANDOFF',
          'COMPLETED',
        ].includes(order.status)
          ? order.updatedAt.toISOString()
          : undefined,
        status: [
          'READY_FOR_DISPATCH',
          'READY_FOR_BUYER_HANDOFF',
          'COMPLETED',
        ].includes(order.status)
          ? 'done'
          : order.status === 'SORTING'
            ? 'current'
            : 'upcoming',
        description:
          'Hub sorts the produce and prepares buyer pickup or delivery.',
      },
      {
        key: 'BUYER_RECEIVING',
        label: complete ? 'Buyer received order' : 'Buyer pickup or delivery',
        occurredAt: complete ? order.updatedAt.toISOString() : undefined,
        status: complete ? 'done' : 'upcoming',
        description: complete
          ? 'Order is completed.'
          : `Hub pickup or delivery instructions for ${order.buyer?.business?.name ?? 'the buyer'} appear after hub receipt.`,
      },
    ];
  }
}
