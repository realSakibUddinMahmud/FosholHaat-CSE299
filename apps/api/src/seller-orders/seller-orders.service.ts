/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  SellerOrderDetailResponse,
  SellerOrderMutationResponse,
  SellerOrderQueueResponse,
  SellerOrderStatus,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SellerOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeller() {
    const user = await this.prisma.user.findFirst({
      where: { role: 'SELLER' },
    });
    if (!user) throw new BadRequestException('No seller found.');
    return user;
  }

  async getSellerOrders(): Promise<SellerOrderQueueResponse> {
    const seller = await this.getSeller();
    const lines = await this.prisma.orderLine.findMany({
      where: { supplyLot: { sellerId: seller.id } },
      include: {
        order: { include: { buyer: true } },
        supplyLot: { include: { product: true } },
      },
    });

    const orders = lines.map((line) => {
      let status: SellerOrderStatus = 'incoming';
      let nextAction: 'accept' | 'pack' | 'ready' | 'none' = 'accept';
      if (line.order.status === 'IN_FULFILLMENT') {
        status = 'accepted';
        nextAction = 'pack';
      } else if (line.order.status === 'READY_FOR_DISPATCH') {
        status = 'ready';
        nextAction = 'none';
      }

      return {
        id: line.id,
        buyerName: line.order.buyer.fullName,
        quantityLabel: `${line.quantity} ${line.supplyLot.unit}`,
        dueLabel: 'TBD',
        status,
        nextAction,
        items: [
          {
            name: line.supplyLot.product.name,
            quantityLabel: `${line.quantity}`,
            packageLabel: line.supplyLot.packageLabel,
          },
        ],
        pickupWindow: 'Bogura Hub',
        notes: [],
      };
    });

    return {
      summary: {
        incoming: orders.filter((o) => o.status === 'incoming').length,
        active: orders.filter((o) => ['accepted', 'packed'].includes(o.status))
          .length,
        ready: orders.filter((o) => o.status === 'ready').length,
      },
      orders: orders.map((o) => ({
        id: o.id,
        buyerName: o.buyerName,
        quantityLabel: o.quantityLabel,
        dueLabel: o.dueLabel,
        status: o.status,
        nextAction: o.nextAction,
      })) as any,
    };
  }

  async getSellerOrder(orderId: string): Promise<SellerOrderDetailResponse> {
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
      include: {
        order: { include: { buyer: true } },
        supplyLot: { include: { product: true } },
      },
    });
    if (!line) throw new NotFoundException('Order not found');

    let status: SellerOrderStatus = 'incoming';
    let nextAction: 'accept' | 'pack' | 'ready' | 'none' = 'accept';
    if (line.order.status === 'IN_FULFILLMENT') {
      status = 'accepted';
      nextAction = 'pack';
    } else if (line.order.status === 'READY_FOR_DISPATCH') {
      status = 'ready';
      nextAction = 'none';
    }

    return {
      order: {
        id: line.id,
        buyerName: line.order.buyer.fullName,
        quantityLabel: `${line.quantity} ${line.supplyLot.unit}`,
        dueLabel: 'TBD',
        status,
        nextAction,
        items: [
          {
            name: line.supplyLot.product.name,
            quantityLabel: `${line.quantity}`,
            packageLabel: line.supplyLot.packageLabel,
          },
        ],
        pickupWindow: 'Bogura Hub',
        notes: [],
      } as any,
    };
  }

  async acceptSellerOrder(
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
    });
    if (!line) throw new NotFoundException('Order not found');
    await this.prisma.order.update({
      where: { id: line.orderId },
      data: { status: 'IN_FULFILLMENT' },
    });
    return {
      ...(await this.getSellerOrder(orderId)),
      message: 'Order accepted',
    };
  }

  async packSellerOrder(orderId: string): Promise<SellerOrderMutationResponse> {
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
    });
    if (!line) throw new NotFoundException('Order not found');
    await this.prisma.order.update({
      where: { id: line.orderId },
      data: { status: 'IN_FULFILLMENT' },
    });
    return { ...(await this.getSellerOrder(orderId)), message: 'Order packed' };
  }

  async readySellerOrder(
    orderId: string,
  ): Promise<SellerOrderMutationResponse> {
    const line = await this.prisma.orderLine.findUnique({
      where: { id: orderId },
    });
    if (!line) throw new NotFoundException('Order not found');
    await this.prisma.order.update({
      where: { id: line.orderId },
      data: { status: 'READY_FOR_DISPATCH' },
    });
    return { ...(await this.getSellerOrder(orderId)), message: 'Order ready' };
  }
}
