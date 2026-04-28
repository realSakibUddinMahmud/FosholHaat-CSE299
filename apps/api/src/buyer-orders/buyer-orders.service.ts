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
      include: {
        lines: { include: { supplyLot: { include: { product: true } } } },
        buyer: { include: { business: true } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    /* ── Build timeline steps ── */
    const timeline: TrackingStep[] = [
      {
        key: 'ORDER_CONFIRMED',
        label: 'Order Confirmed',
        occurredAt: order.createdAt.toISOString(),
        status: 'done',
        description:
          'Payment verified and order transmitted to supplier hub.',
      },
    ];

    const isShipped =
      order.status !== 'PENDING_PAYMENT' && order.status !== 'CONFIRMED';

    timeline.push({
      key: 'PACKED_AT_HUB',
      label: 'Packed at Bogura Hub',
      occurredAt: isShipped ? order.updatedAt.toISOString() : undefined,
      status: isShipped ? 'done' : 'upcoming',
      description: isShipped
        ? 'Quality inspection complete. Bags secured for transit.'
        : undefined,
    });

    timeline.push({
      key: 'IN_TRANSIT',
      label: 'In Transit to Dhaka Central',
      occurredAt: isShipped ? undefined : undefined,
      status: isShipped ? 'current' : 'upcoming',
      description: isShipped
        ? 'Estimated Arrival: Today, 07:45 PM (ETA 2h 15m)'
        : undefined,
    });

    const estimatedDelivery = new Date(
      order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000,
    );
    timeline.push({
      key: 'SCHEDULED_DELIVERY',
      label: 'Scheduled for Delivery',
      occurredAt: undefined,
      status: 'upcoming',
      description: `Doorstep delivery at ${order.buyer?.business?.name ?? 'your warehouse'}. Expected ${estimatedDelivery.toLocaleDateString('en-BD', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
    });

    /* ── Build snapshot ── */
    const firstLine = order.lines[0];
    const itemsText = order.lines
      .map(
        (l) => `${l.quantity} ${l.supplyLot.unit}: ${l.supplyLot.product.name}`,
      )
      .join(', ');
    const snapshot = {
      title: itemsText.substring(0, 60),
      sku: firstLine
        ? `FH-${firstLine.supplyLot.product.category?.substring(0, 3).toUpperCase()}-${firstLine.supplyLotId.substring(0, 4)}`
        : 'N/A',
      total: order.total.toLocaleString('en-BD'),
      deliveryAddress:
        'Standard Agro Warehouse, Plot 14, Sector 7, Uttara, Dhaka 1230',
      contactName: order.buyer?.fullName ?? 'Buyer',
      contactPhone: '+880 1712-XXXXXX',
    };

    /* ── Logistics intel ── */
    const logistics = {
      originHub: 'Bogura Hub',
      destinationHub: 'Dhaka Central Hub',
      truckId: 'DH-METRO-1234',
      fleetPartner: 'FosholLogistics™',
      lastPing: 'Jamuna Bridge Toll Plaza (GPS Lock)',
      speed: '54 km/h',
    };

    return { orderId: id, timeline, snapshot, logistics };
  }
}
