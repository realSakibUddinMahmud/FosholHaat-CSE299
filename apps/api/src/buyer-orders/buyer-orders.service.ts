/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  BuyerOrderSummary,
  BuyerOrderDetail,
  BuyerOrderTrackingResponse,
  TrackingStep,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuyerOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBuyer() {
    const user = await this.prisma.user.findFirst({ where: { role: 'BUYER' } });
    if (!user) throw new BadRequestException('No buyer found.');
    return user;
  }

  async getOrders(): Promise<BuyerOrderSummary[]> {
    const buyer = await this.getBuyer();
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
        status: order.status as any,
        title: `${order.lines.length} Items: ${itemsText}`.substring(0, 50),
        total: `৳${order.total}`,
        estDelivery: 'TBD', // Delivery calculation omitted for MVP
        imageUrl: order.lines[0]?.supplyLot?.product?.imageUrl || '',
        dateGroup: order.createdAt.toLocaleDateString(),
      };
    });
  }

  async getOrderDetail(id: string): Promise<BuyerOrderDetail> {
    const order = await this.prisma.order.findUnique({
      where: { code: id },
      include: {
        lines: { include: { supplyLot: { include: { product: true } } } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const itemsText = order.lines
      .map((l) => l.supplyLot.product.name)
      .join(', ');

    return {
      id: order.code,
      status: order.status as any,
      title: `${order.lines.length} Items: ${itemsText}`.substring(0, 50),
      total: `৳${order.total}`,
      estDelivery: 'TBD',
      imageUrl: order.lines[0]?.supplyLot?.product?.imageUrl || '',
      dateGroup: order.createdAt.toLocaleDateString(),
      items: order.lines.map((l) => ({
        name: l.supplyLot.product.name,
        quantity: `${l.quantity} ${l.supplyLot.unit}`,
        price: `৳${l.quantity * l.unitPrice}`,
      })),
      shippingAddress: 'Set in fulfillment step',
      paymentMethod:
        order.paymentStatus === 'PENDING' ? 'Cash on Delivery' : 'Paid',
      subtotal: `৳${order.subtotal}`,
      deliveryFee: `৳${order.total - order.subtotal}`,
    };
  }

  async getOrderTracking(id: string): Promise<BuyerOrderTrackingResponse> {
    const order = await this.prisma.order.findUnique({
      where: { code: id },
    });
    if (!order) throw new NotFoundException('Order not found');

    const timeline: TrackingStep[] = [
      {
        key: 'placed',
        label: 'Order Placed',
        occurredAt: order.createdAt.toLocaleString(),
        status: 'done',
      },
    ];

    if (order.status === 'PENDING_PAYMENT' || order.status === 'CONFIRMED') {
      timeline.push({
        key: 'processing',
        label: 'Processing at Hub',
        status: 'upcoming',
      });
    } else {
      timeline.push({ key: 'processing', label: 'Processed', status: 'done' });
      timeline.push({ key: 'shipped', label: 'Shipped', status: 'current' });
    }

    return { orderId: id, timeline };
  }
}
