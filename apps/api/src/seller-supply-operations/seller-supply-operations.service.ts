/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateSellerSupplyInput,
  SellerDwrDetailResponse,
  SellerDwrListResponse,
  SellerSupplyListResponse,
  SellerSupplyMutationResponse,
  UpdateSellerSupplyInput,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentSeller } from '../auth/current-user';

function packStockHint(hint: string, photoUrls: string[] = []) {
  return JSON.stringify({ hint, photoUrls: photoUrls.slice(0, 3) });
}

function unpackStockHint(value: string) {
  try {
    const parsed = JSON.parse(value) as { hint?: string; photoUrls?: string[] };
    return {
      hint: parsed.hint || 'New lot',
      photoUrls: Array.isArray(parsed.photoUrls)
        ? parsed.photoUrls.slice(0, 3)
        : [],
    };
  } catch {
    return { hint: value, photoUrls: [] };
  }
}

function assertSaleSettings(input: {
  quantity: number;
  askingPrice: number;
  singleBuyEnabled?: boolean;
  groupBuyEnabled?: boolean;
  singleMinQty?: number;
  singleMaxQty?: number;
  groupTargetQty?: number;
  groupMinQty?: number;
  groupMaxQty?: number;
  groupPrice?: number;
}) {
  const singleBuyEnabled = input.singleBuyEnabled !== false;
  const groupBuyEnabled = input.groupBuyEnabled === true;
  if (!singleBuyEnabled && !groupBuyEnabled) {
    throw new BadRequestException('Choose single buy, group buy, or both.');
  }
  const singleMinQty = Math.max(1, input.singleMinQty ?? 1);
  const singleMaxQty = input.singleMaxQty ?? input.quantity;
  if (
    singleBuyEnabled &&
    (singleMaxQty < singleMinQty || singleMaxQty > input.quantity)
  ) {
    throw new BadRequestException(
      'Single-buy quantity must stay inside available stock.',
    );
  }
  const groupTargetQty = input.groupTargetQty ?? input.quantity;
  if (
    groupBuyEnabled &&
    (groupTargetQty <= 0 || groupTargetQty > input.quantity)
  ) {
    throw new BadRequestException(
      'Group-buy target must stay inside available stock.',
    );
  }
  const groupMinQty = Math.max(1, input.groupMinQty ?? 1);
  const groupMaxQty = input.groupMaxQty ?? groupTargetQty;
  if (
    groupBuyEnabled &&
    (groupMinQty > groupTargetQty ||
      groupMaxQty < groupMinQty ||
      groupMaxQty > groupTargetQty)
  ) {
    throw new BadRequestException(
      'Group-buy min and max must stay inside the target quantity.',
    );
  }
  const groupPrice =
    input.groupPrice ?? Math.max(1, Math.floor(input.askingPrice * 0.95));
  if (groupBuyEnabled && groupPrice > input.askingPrice) {
    throw new BadRequestException(
      'Group price cannot be higher than asking price.',
    );
  }
  return {
    singleBuyEnabled,
    groupBuyEnabled,
    singleMinQty,
    singleMaxQty,
    groupTargetQty,
    groupMinQty,
    groupMaxQty,
    groupPrice,
  };
}

@Injectable()
export class SellerSupplyOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSellerSupply(
    authorization: string | undefined,
  ): Promise<SellerSupplyListResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const lots = await this.prisma.supplyLot.findMany({
      where: { sellerId: seller.id },
      include: { product: true, inboundReceipts: true, groupBuys: true },
    });

    return {
      workspace: {
        sellerName: seller.fullName,
        marketLabel: 'Bogura -> Dhaka corridor',
        metrics: [
          {
            key: 'active',
            label: 'Active lots',
            value: lots.filter((l) => l.status === 'ACTIVE').length,
          },
        ],
        primaryActionRoute: '/seller/supply/new',
      },
      listings: lots.map((lot) => {
        const stock = unpackStockHint(lot.stockHint);
        return {
          id: lot.id,
          commodity: lot.product.slug as any,
          commodityLabel: lot.product.name,
          quantity: lot.quantity,
          unit: lot.unit as any,
          gradeLabel: lot.gradeLabel,
          packageLabel: lot.packageLabel,
          askingPrice: lot.askingPrice,
          availableFrom: lot.availableFrom
            ? lot.availableFrom.toISOString()
            : undefined,
          status: lot.status === 'ACTIVE' ? 'active' : 'scheduled',
          stockHint: stock.hint,
          photoUrls: stock.photoUrls,
          singleBuyEnabled: lot.singleBuyEnabled,
          groupBuyEnabled: lot.groupBuyEnabled,
          singleMinQty: lot.singleMinQty,
          singleMaxQty: lot.singleMaxQty ?? lot.quantity,
          groupTargetQty: lot.groupBuys.find((gb) => gb.status === 'LIVE')
            ?.targetQty,
          groupMinQty: lot.groupBuys.find((gb) => gb.status === 'LIVE')
            ?.minimumJoinQty,
          groupMaxQty:
            lot.groupBuys.find((gb) => gb.status === 'LIVE')?.maximumJoinQty ??
            undefined,
          groupDeadline: lot.groupBuys
            .find((gb) => gb.status === 'LIVE')
            ?.deadlineAt.toISOString(),
          groupPrice: lot.groupBuys.find((gb) => gb.status === 'LIVE')
            ?.groupPrice,
          dwrRecordId: lot.inboundReceipts.find((r) => r.status === 'RECEIVED')
            ?.id,
        };
      }),
    };
  }

  async createSellerSupply(
    authorization: string | undefined,
    input: CreateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const product = await this.prisma.product.findFirst({
      where: { category: input.commodity },
    });
    if (!product) throw new BadRequestException('Product not found');

    const hub = await this.prisma.hub.findFirst();
    if (!hub) throw new BadRequestException('No hub available to generate DWR');
    const sale = assertSaleSettings(input);

    const lot = await this.prisma.supplyLot.create({
      data: {
        code: `LOT-${Date.now()}`,
        sellerId: seller.id,
        businessId: seller.businessId,
        productId: product.id,
        commodityLabel: product.name,
        gradeLabel: input.gradeLabel,
        packageLabel: 'Standard',
        quantity: input.quantity,
        availableQty: input.quantity,
        unit: input.unit,
        askingPrice: input.askingPrice,
        singleBuyEnabled: sale.singleBuyEnabled,
        groupBuyEnabled: sale.groupBuyEnabled,
        singleMinQty: sale.singleMinQty,
        singleMaxQty: sale.singleBuyEnabled ? sale.singleMaxQty : null,
        status: 'ACTIVE',
        stockHint: packStockHint('New lot', input.photoUrls),
        availableFrom: input.availableFrom
          ? new Date(input.availableFrom)
          : new Date(),
        inboundReceipts: {
          create: {
            code: `DWR-${Date.now()}`,
            hubId: hub.id,
            expectedQty: input.quantity,
            status: 'PENDING',
            notes: 'Generated upon seller supply declaration',
          },
        },
      },
      include: { product: true, inboundReceipts: true, groupBuys: true },
    });

    const stock = unpackStockHint(lot.stockHint);
    if (sale.groupBuyEnabled) {
      await this.prisma.groupBuy.create({
        data: {
          code: `GB-${Date.now()}`,
          productId: lot.productId,
          supplyLotId: lot.id,
          targetQty: sale.groupTargetQty,
          minimumJoinQty: sale.groupMinQty,
          maximumJoinQty: sale.groupMaxQty,
          committedQty: 0,
          groupPrice: sale.groupPrice,
          status: 'LIVE',
          deadlineAt: input.groupDeadline
            ? new Date(input.groupDeadline)
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      });
    }
    return {
      listing: {
        id: lot.id,
        commodity: lot.product.slug as any,
        commodityLabel: lot.product.name,
        quantity: lot.quantity,
        unit: lot.unit as any,
        gradeLabel: lot.gradeLabel,
        packageLabel: lot.packageLabel,
        askingPrice: lot.askingPrice,
        availableFrom: lot.availableFrom?.toISOString(),
        status: 'active',
        stockHint: stock.hint,
        photoUrls: stock.photoUrls,
        singleBuyEnabled: lot.singleBuyEnabled,
        groupBuyEnabled: lot.groupBuyEnabled,
        singleMinQty: lot.singleMinQty,
        singleMaxQty: lot.singleMaxQty ?? lot.quantity,
        groupTargetQty: sale.groupBuyEnabled ? sale.groupTargetQty : undefined,
        groupMinQty: sale.groupBuyEnabled ? sale.groupMinQty : undefined,
        groupMaxQty: sale.groupBuyEnabled ? sale.groupMaxQty : undefined,
        groupDeadline: sale.groupBuyEnabled
          ? input.groupDeadline ||
            new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
          : undefined,
        groupPrice: sale.groupBuyEnabled ? sale.groupPrice : undefined,
        dwrRecordId: lot.inboundReceipts.find((r) => r.status === 'RECEIVED')
          ?.id as any,
      },
      message: 'Supply created successfully',
    };
  }

  async updateSellerSupply(
    authorization: string | undefined,
    listingId: string,
    input: UpdateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);

    // Verify ownership
    const existing = await this.prisma.supplyLot.findUnique({
      where: { id: listingId },
      include: { groupBuys: true },
    });
    if (!existing) throw new NotFoundException('Supply lot not found');
    if (existing.sellerId !== seller.id) {
      throw new ForbiddenException('Not your supply lot');
    }

    const data: any = {};
    if (input.quantity) {
      data.quantity = input.quantity;
      data.availableQty = input.quantity;
    }
    if (input.askingPrice) data.askingPrice = input.askingPrice;
    if (input.gradeLabel) data.gradeLabel = input.gradeLabel;
    if (input.status)
      data.status = input.status === 'active' ? 'ACTIVE' : 'SCHEDULED';
    if (input.availableFrom) data.availableFrom = new Date(input.availableFrom);
    if (input.photoUrls) {
      data.stockHint = packStockHint(
        unpackStockHint(existing.stockHint).hint,
        input.photoUrls,
      );
    }
    const nextQuantity = input.quantity ?? existing.quantity;
    const sale =
      input.singleBuyEnabled !== undefined ||
      input.groupBuyEnabled !== undefined ||
      input.singleMinQty !== undefined ||
      input.singleMaxQty !== undefined ||
      input.groupTargetQty !== undefined ||
      input.groupMinQty !== undefined ||
      input.groupMaxQty !== undefined ||
      input.groupPrice !== undefined
        ? assertSaleSettings({
            quantity: nextQuantity,
            askingPrice: input.askingPrice ?? existing.askingPrice,
            singleBuyEnabled:
              input.singleBuyEnabled ?? existing.singleBuyEnabled,
            groupBuyEnabled: input.groupBuyEnabled ?? existing.groupBuyEnabled,
            singleMinQty: input.singleMinQty ?? existing.singleMinQty,
            singleMaxQty:
              input.singleMaxQty ?? existing.singleMaxQty ?? nextQuantity,
            groupTargetQty:
              input.groupTargetQty ??
              existing.groupBuys.find((gb) => gb.status === 'LIVE')
                ?.targetQty ??
              nextQuantity,
            groupMinQty:
              input.groupMinQty ??
              existing.groupBuys.find((gb) => gb.status === 'LIVE')
                ?.minimumJoinQty,
            groupMaxQty:
              input.groupMaxQty ??
              existing.groupBuys.find((gb) => gb.status === 'LIVE')
                ?.maximumJoinQty ??
              undefined,
            groupPrice:
              input.groupPrice ??
              existing.groupBuys.find((gb) => gb.status === 'LIVE')?.groupPrice,
          })
        : undefined;
    if (sale) {
      data.singleBuyEnabled = sale.singleBuyEnabled;
      data.groupBuyEnabled = sale.groupBuyEnabled;
      data.singleMinQty = sale.singleMinQty;
      data.singleMaxQty = sale.singleBuyEnabled ? sale.singleMaxQty : null;
    }

    const lot = await this.prisma.supplyLot.update({
      where: { id: listingId },
      data,
      include: { product: true, inboundReceipts: true, groupBuys: true },
    });
    if (sale?.groupBuyEnabled) {
      const activeGroup = existing.groupBuys.find((gb) => gb.status === 'LIVE');
      if (activeGroup) {
        await this.prisma.groupBuy.update({
          where: { id: activeGroup.id },
          data: {
            targetQty: sale.groupTargetQty,
            minimumJoinQty: sale.groupMinQty,
            maximumJoinQty: sale.groupMaxQty,
            groupPrice: sale.groupPrice,
            deadlineAt: input.groupDeadline
              ? new Date(input.groupDeadline)
              : activeGroup.deadlineAt,
          },
        });
      } else {
        await this.prisma.groupBuy.create({
          data: {
            code: `GB-${Date.now()}`,
            productId: lot.productId,
            supplyLotId: lot.id,
            targetQty: sale.groupTargetQty,
            minimumJoinQty: sale.groupMinQty,
            maximumJoinQty: sale.groupMaxQty,
            groupPrice: sale.groupPrice,
            status: 'LIVE',
            deadlineAt: input.groupDeadline
              ? new Date(input.groupDeadline)
              : new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        });
      }
    } else if (sale && !sale.groupBuyEnabled) {
      await this.prisma.groupBuy.updateMany({
        where: { supplyLotId: lot.id, status: 'LIVE' },
        data: { status: 'CANCELLED' },
      });
    }

    const stock = unpackStockHint(lot.stockHint);
    const activeGroup = lot.groupBuys.find((gb) => gb.status === 'LIVE');
    return {
      listing: {
        id: lot.id,
        commodity: lot.product.slug as any,
        commodityLabel: lot.product.name,
        quantity: lot.quantity,
        unit: lot.unit as any,
        gradeLabel: lot.gradeLabel,
        packageLabel: lot.packageLabel,
        askingPrice: lot.askingPrice,
        availableFrom: lot.availableFrom?.toISOString(),
        status: lot.status === 'ACTIVE' ? 'active' : 'scheduled',
        stockHint: stock.hint,
        photoUrls: stock.photoUrls,
        singleBuyEnabled: lot.singleBuyEnabled,
        groupBuyEnabled: lot.groupBuyEnabled,
        singleMinQty: lot.singleMinQty,
        singleMaxQty: lot.singleMaxQty ?? lot.quantity,
        groupTargetQty: activeGroup?.targetQty,
        groupMinQty: activeGroup?.minimumJoinQty,
        groupMaxQty: activeGroup?.maximumJoinQty ?? undefined,
        groupDeadline: activeGroup?.deadlineAt.toISOString(),
        groupPrice: activeGroup?.groupPrice,
        dwrRecordId: lot.inboundReceipts.find((r) => r.status === 'RECEIVED')
          ?.id as any,
      },
      message: 'Supply updated',
    };
  }

  async getSellerDwrList(
    authorization: string | undefined,
  ): Promise<SellerDwrListResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const receipts = await this.prisma.inboundReceipt.findMany({
      where: { supplyLot: { sellerId: seller.id } },
      include: {
        supplyLot: { include: { product: true } },
        hub: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      records: receipts.map((receipt) => ({
        id: receipt.id,
        recordCode: receipt.code,
        commodityLabel: receipt.supplyLot.product.name,
        quantity: receipt.expectedQty,
        unit: receipt.supplyLot.unit as any,
        status: receipt.status,
        hubLabel: receipt.hub.name,
        receivedAt: receipt.createdAt.toISOString(),
      })),
    };
  }

  async getSellerDwrRecord(
    authorization: string | undefined,
    recordId: string,
  ): Promise<SellerDwrDetailResponse> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const receipt = await this.prisma.inboundReceipt.findUnique({
      where: { id: recordId },
      include: {
        supplyLot: { include: { product: true } },
        hub: true,
        receiver: true,
      },
    });

    if (!receipt) throw new NotFoundException('DWR not found');

    // Verify the receipt belongs to the current seller's supply lot
    if (receipt.supplyLot.sellerId !== seller.id) {
      throw new ForbiddenException('DWR does not belong to current seller');
    }

    return {
      record: {
        id: receipt.id,
        listingId: receipt.supplyLotId,
        recordCode: receipt.code,
        commodityLabel: receipt.supplyLot.product.name,
        gradeLabel: receipt.supplyLot.gradeLabel,
        packageLabel: receipt.supplyLot.packageLabel,
        quantity: receipt.expectedQty,
        unit: receipt.supplyLot.unit as any,
        askingPrice: receipt.supplyLot.askingPrice,
        receivedAt: receipt.createdAt.toISOString(),
        hubLabel: receipt.hub.name,
        inspectorLabel: receipt.receiver?.fullName || 'Pending',
        notes: receipt.notes ? [receipt.notes] : [],
      },
    };
  }
}
