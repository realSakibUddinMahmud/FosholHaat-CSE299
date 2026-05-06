/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import {
  GroupBuySummary,
  GroupBuyDetail,
  JoinGroupBuyDto,
  JoinGroupBuyResponse,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentBuyer } from '../auth/current-user';

function unpackPhotoUrls(value: string) {
  try {
    const parsed = JSON.parse(value) as { photoUrls?: string[] };
    return Array.isArray(parsed.photoUrls) ? parsed.photoUrls.slice(0, 3) : [];
  } catch {
    return [];
  }
}

function apiStatus(status: string) {
  return status === 'LIVE' ? 'ACTIVE' : status;
}

@Injectable()
export class BuyerGroupBuyService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupBuys(authorization?: string): Promise<GroupBuySummary[]> {
    const groupBuys = await this.prisma.groupBuy.findMany({
      where: {
        status: 'LIVE',
        supplyLot: {
          groupBuyEnabled: true,
        },
      },
      include: {
        product: true,
        supplyLot: { include: { seller: { include: { business: true } }, business: true } },
        commitments: true,
      },
    });

    return groupBuys.map((gb) => {
      const sellerName =
        gb.supplyLot.business?.name ||
        gb.supplyLot.seller.business?.name ||
        gb.supplyLot.seller.fullName;
      return {
      id: gb.code,
      productId: gb.product.category,
      productName: { bn: gb.product.name, en: gb.product.name },
      productImage:
        unpackPhotoUrls(gb.supplyLot.stockHint)[0] || gb.product.imageUrl || '',
      unitPrice: gb.supplyLot.askingPrice,
      groupPrice: gb.groupPrice,
      targetQuantity: gb.targetQty,
      currentQuantity: gb.committedQty,
      deadline: gb.deadlineAt.toISOString(),
      status: apiStatus(gb.status) as any,
      participantCount: gb.commitments.length,
      unit: { bn: gb.supplyLot.unit, en: gb.supplyLot.unit },
      sellerName,
    };
    });
  }

  async getGroupBuyDetail(
    authorization: string | undefined,
    id: string,
  ): Promise<GroupBuyDetail | undefined> {
    const gb = await this.prisma.groupBuy.findFirst({
      where: {
        code: id,
        supplyLot: {
          groupBuyEnabled: true,
        },
      },
      include: {
        product: true,
        supplyLot: { include: { seller: { include: { business: true } }, business: true } },
        commitments: true,
      },
    });

    if (!gb) return undefined;

    return {
      id: gb.code,
      productId: gb.product.category,
      productName: { bn: gb.product.name, en: gb.product.name },
      productImage:
        unpackPhotoUrls(gb.supplyLot.stockHint)[0] || gb.product.imageUrl || '',
      unitPrice: gb.supplyLot.askingPrice,
      groupPrice: gb.groupPrice,
      targetQuantity: gb.targetQty,
      currentQuantity: gb.committedQty,
      deadline: gb.deadlineAt.toISOString(),
      status: apiStatus(gb.status) as any,
      participantCount: gb.commitments.length,
      description: {
        bn: `Group buy for ${gb.product.name}`,
        en: `Group buy for ${gb.product.name}`,
      },
      sellerName:
        gb.supplyLot.business?.name ||
        gb.supplyLot.seller.business?.name ||
        gb.supplyLot.seller.fullName,
      minimumJoinQuantity: gb.minimumJoinQty,
      maximumJoinQuantity: gb.maximumJoinQty ?? gb.targetQty,
      unit: { bn: gb.supplyLot.unit, en: gb.supplyLot.unit },
    };
  }

  async joinGroupBuy(
    authorization: string | undefined,
    id: string,
    request: JoinGroupBuyDto,
  ): Promise<JoinGroupBuyResponse> {
    const gb = await this.prisma.groupBuy.findUnique({
      where: { code: id },
      include: { supplyLot: true },
    });
    if (!gb) return { success: false, message: 'Group buy not found' };

    if (!Number.isFinite(request.quantity) || request.quantity <= 0) {
      return { success: false, message: 'Join quantity must be positive' };
    }
    const maxJoin = gb.maximumJoinQty ?? gb.targetQty;
    if (request.quantity < gb.minimumJoinQty || request.quantity > maxJoin) {
      return {
        success: false,
        message: `Join quantity must be between ${gb.minimumJoinQty} and ${maxJoin}.`,
      };
    }

    if (gb.status !== 'LIVE') {
      return {
        success: false,
        message: 'Group buy is no longer active',
      };
    }

    const buyer = await resolveCurrentBuyer(this.prisma, authorization);

    if (
      !gb.supplyLot.groupBuyEnabled ||
      gb.committedQty + request.quantity > gb.targetQty
    ) {
      return {
        success: false,
        message: 'Quantity exceeds the remaining group-buy target',
      };
    }
    await this.prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findFirst({
        where: { userId: buyer.id, status: 'ACTIVE' },
      });
      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId: buyer.id,
            status: 'ACTIVE',
            locale: buyer.locale as any,
          },
        });
      }

      const line = await tx.cartLine.findFirst({
        where: {
          cartId: cart.id,
          supplyLotId: gb.supplyLotId,
          mode: 'GROUP',
          groupBuyId: gb.id,
        },
      });
      if (line) {
        await tx.cartLine.update({
          where: { id: line.id },
          data: {
            quantity: line.quantity + request.quantity,
            unitPrice: gb.groupPrice,
          },
        });
      } else {
        await tx.cartLine.create({
          data: {
            cartId: cart.id,
            supplyLotId: gb.supplyLotId,
            quantity: request.quantity,
            unitPrice: gb.groupPrice,
            mode: 'GROUP',
            groupBuyId: gb.id,
          },
        });
      }
    });

    return {
      success: true,
      message:
        'Group-buy quantity added to cart. Checkout now; fulfillment waits until the target is filled.',
    };
  }
}
