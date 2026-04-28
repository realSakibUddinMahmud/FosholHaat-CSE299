/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  GroupBuySummary,
  GroupBuyDetail,
  JoinGroupBuyDto,
  JoinGroupBuyResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuyerGroupBuyService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBuyer() {
    const user = await this.prisma.user.findFirst({ where: { role: 'BUYER' } });
    if (!user) throw new BadRequestException('No buyer found.');
    return user;
  }

  async getGroupBuys(): Promise<GroupBuySummary[]> {
    const groupBuys = await this.prisma.groupBuy.findMany({
      include: {
        product: true,
        supplyLot: { include: { seller: true, business: true } },
        commitments: true,
      },
    });

    return groupBuys.map((gb) => ({
      id: gb.code,
      productId: gb.product.slug,
      productName: { bn: gb.product.name, en: gb.product.name },
      productImage: gb.product.imageUrl || '',
      unitPrice: gb.supplyLot.askingPrice,
      groupPrice: gb.groupPrice,
      targetQuantity: gb.targetQty,
      currentQuantity: gb.committedQty,
      deadline: gb.deadlineAt.toISOString(),
      status: gb.status as any,
      participantCount: gb.commitments.length,
      unit: { bn: gb.supplyLot.unit, en: gb.supplyLot.unit },
    }));
  }

  async getGroupBuyDetail(id: string): Promise<GroupBuyDetail | undefined> {
    const gb = await this.prisma.groupBuy.findUnique({
      where: { code: id },
      include: {
        product: true,
        supplyLot: { include: { seller: true, business: true } },
        commitments: true,
      },
    });

    if (!gb) return undefined;

    return {
      id: gb.code,
      productId: gb.product.slug,
      productName: { bn: gb.product.name, en: gb.product.name },
      productImage: gb.product.imageUrl || '',
      unitPrice: gb.supplyLot.askingPrice,
      groupPrice: gb.groupPrice,
      targetQuantity: gb.targetQty,
      currentQuantity: gb.committedQty,
      deadline: gb.deadlineAt.toISOString(),
      status: gb.status as any,
      participantCount: gb.commitments.length,
      description: {
        bn: `Group buy for ${gb.product.name}`,
        en: `Group buy for ${gb.product.name}`,
      },
      sellerName: gb.supplyLot.business?.name || gb.supplyLot.seller.fullName,
      minimumJoinQuantity: 1,
      unit: { bn: gb.supplyLot.unit, en: gb.supplyLot.unit },
    };
  }

  async joinGroupBuy(
    id: string,
    request: JoinGroupBuyDto,
  ): Promise<JoinGroupBuyResponse> {
    const gb = await this.prisma.groupBuy.findUnique({ where: { code: id } });
    if (!gb) return { success: false, message: 'Group buy not found' };

    if (!Number.isFinite(request.quantity) || request.quantity <= 0) {
      return { success: false, message: 'Join quantity must be positive' };
    }

    if (gb.status !== 'LIVE') {
      return {
        success: false,
        message: 'Group buy is no longer active',
      };
    }

    const buyer = await this.getBuyer();

    const existing = await this.prisma.groupBuyCommitment.findUnique({
      where: { groupBuyId_buyerId: { groupBuyId: gb.id, buyerId: buyer.id } },
    });

    if (existing) {
      await this.prisma.groupBuyCommitment.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + request.quantity },
      });
    } else {
      await this.prisma.groupBuyCommitment.create({
        data: {
          groupBuyId: gb.id,
          buyerId: buyer.id,
          quantity: request.quantity,
        },
      });
    }

    await this.prisma.groupBuy.update({
      where: { id: gb.id },
      data: { committedQty: gb.committedQty + request.quantity },
    });

    return {
      success: true,
      orderId: `ord-gb-${Math.random().toString(36).slice(2, 11)}`,
      message: 'Successfully joined the group buy!',
    };
  }
}
