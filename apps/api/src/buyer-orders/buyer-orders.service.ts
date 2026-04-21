import { Injectable, NotFoundException } from '@nestjs/common';
import {
  BuyerOrderSummary,
  BuyerOrderDetail,
  BuyerOrderTrackingResponse,
  TrackingStep,
} from '@fosholhaat/types';

@Injectable()
export class BuyerOrdersService {
  private orders: BuyerOrderDetail[] = [
    {
      id: 'FH-8492',
      status: 'IN_TRANSIT',
      title: '60 Bags: Red Onions, Premium Rice',
      total: '৳45,200',
      estDelivery: 'Oct 26',
      imageUrl:
        'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=200',
      dateGroup: 'TODAY, 24 OCT',
      items: [
        { name: 'Red Onions', quantity: '40 Bags', price: '৳28,000' },
        { name: 'Premium Rice', quantity: '20 Bags', price: '৳17,200' },
      ],
      shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
      paymentMethod: 'Cash on Delivery',
      subtotal: '৳45,000',
      deliveryFee: '৳200',
    },
    {
      id: 'FH-8510',
      status: 'PROCESSING',
      title: '120 Sacks: Green Lentils (Grade A)',
      total: '৳1,12,000',
      estDelivery: 'Oct 28',
      imageUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200',
      dateGroup: 'TODAY, 24 OCT',
      items: [
        {
          name: 'Green Lentils (Grade A)',
          quantity: '120 Sacks',
          price: '৳1,11,500',
        },
      ],
      shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
      paymentMethod: 'Bank Transfer',
      subtotal: '৳1,11,500',
      deliveryFee: '৳500',
    },
    {
      id: 'FH-8388',
      status: 'SHIPPED',
      title: '45 Crates: Fresh Ginger, Garlic',
      total: '৳32,800',
      estDelivery: 'Oct 25',
      imageUrl:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200',
      dateGroup: 'YESTERDAY, 23 OCT',
      items: [
        { name: 'Fresh Ginger', quantity: '25 Crates', price: '৳18,000' },
        { name: 'Garlic', quantity: '20 Crates', price: '৳14,500' },
      ],
      shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
      paymentMethod: 'Cash on Delivery',
      subtotal: '৳32,500',
      deliveryFee: '৳300',
    },
  ];

  getOrders(): BuyerOrderSummary[] {
    return this.orders.map((order) => ({
      id: order.id,
      status: order.status,
      title: order.title,
      total: order.total,
      estDelivery: order.estDelivery,
      imageUrl: order.imageUrl,
      dateGroup: order.dateGroup,
    }));
  }

  getOrderDetail(id: string): BuyerOrderDetail {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  getOrderTracking(id: string): BuyerOrderTrackingResponse {
    const order = this.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException('Order not found');

    const timeline: TrackingStep[] = [
      {
        key: 'placed',
        label: 'Order Placed',
        occurredAt: 'Oct 24, 09:00 AM',
        status: 'done',
      },
      {
        key: 'confirmed',
        label: 'Order Confirmed',
        occurredAt: 'Oct 24, 10:30 AM',
        status: 'done',
      },
    ];

    if (order.status === 'PROCESSING') {
      timeline.push({
        key: 'processing',
        label: 'Processing at Hub',
        status: 'current',
      });
      timeline.push({ key: 'shipped', label: 'Shipped', status: 'upcoming' });
      timeline.push({
        key: 'delivered',
        label: 'Delivered',
        status: 'upcoming',
      });
    } else if (order.status === 'SHIPPED') {
      timeline.push({
        key: 'processing',
        label: 'Processed',
        occurredAt: 'Oct 24, 02:00 PM',
        status: 'done',
      });
      timeline.push({
        key: 'shipped',
        label: 'Shipped',
        occurredAt: 'Oct 24, 04:30 PM',
        status: 'done',
      });
      timeline.push({ key: 'transit', label: 'In Transit', status: 'current' });
      timeline.push({
        key: 'delivered',
        label: 'Delivered',
        status: 'upcoming',
      });
    } else if (order.status === 'IN_TRANSIT') {
      timeline.push({
        key: 'processing',
        label: 'Processed',
        occurredAt: 'Oct 24, 02:00 PM',
        status: 'done',
      });
      timeline.push({
        key: 'shipped',
        label: 'Shipped',
        occurredAt: 'Oct 24, 04:30 PM',
        status: 'done',
      });
      timeline.push({
        key: 'transit',
        label: 'In Transit',
        occurredAt: 'Oct 25, 08:00 AM',
        status: 'done',
      });
      timeline.push({
        key: 'arrived',
        label: 'Arrived at Local Hub',
        status: 'current',
      });
      timeline.push({
        key: 'delivered',
        label: 'Delivered',
        status: 'upcoming',
      });
    }

    return { orderId: id, timeline };
  }
}
