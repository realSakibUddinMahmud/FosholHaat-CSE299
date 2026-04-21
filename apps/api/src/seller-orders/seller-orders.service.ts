import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  SellerOrderDetail,
  SellerOrderDetailResponse,
  SellerOrderMutationResponse,
  SellerOrderQueueResponse,
  SellerOrderStatus,
} from '@fosholhaat/types';

const sellerOrderSeed: SellerOrderDetail[] = [
  {
    id: 'SO-4101',
    buyerName: 'Nabanno Traders',
    quantityLabel: '40 bags potato',
    dueLabel: 'Today 5:00 PM',
    status: 'incoming',
    nextAction: 'accept',
    items: [
      { name: 'Potato', quantityLabel: '40 bags', packageLabel: 'Jute bag' },
    ],
    pickupWindow: 'Bogura hub, 4:00 PM to 6:00 PM',
    notes: ['Buyer requested fresh load confirmation before release.'],
  },
  {
    id: 'SO-4102',
    buyerName: 'Rahman Wholesale',
    quantityLabel: '22 crates onion',
    dueLabel: 'Tomorrow 10:00 AM',
    status: 'accepted',
    nextAction: 'pack',
    items: [
      {
        name: 'Onion',
        quantityLabel: '22 crates',
        packageLabel: 'Plastic crate',
      },
    ],
    pickupWindow: 'Bogura hub, 8:00 AM to 10:00 AM',
    notes: ['Order accepted, packing team assigned.'],
  },
  {
    id: 'SO-4103',
    buyerName: 'Karim Fresh Chain',
    quantityLabel: '120 kg vegetables',
    dueLabel: 'Tomorrow 6:00 AM',
    status: 'packed',
    nextAction: 'ready',
    items: [
      {
        name: 'Mixed vegetables',
        quantityLabel: '120 kg',
        packageLabel: 'Loose kg lot',
      },
    ],
    pickupWindow: 'Early truck handoff before 6:00 AM',
    notes: ['Cold chain crate check completed.'],
  },
];

function assertTransition(current: SellerOrderStatus, next: SellerOrderStatus) {
  const valid =
    (current === 'incoming' && (next === 'accepted' || next === 'rejected')) ||
    (current === 'accepted' && next === 'packed') ||
    (current === 'packed' && next === 'ready');

  if (!valid) {
    throw new BadRequestException({ message: 'Invalid transition' });
  }
}

function nextActionFor(
  status: SellerOrderStatus,
): SellerOrderDetail['nextAction'] {
  if (status === 'incoming') return 'accept';
  if (status === 'accepted') return 'pack';
  if (status === 'packed') return 'ready';
  return 'none';
}

@Injectable()
export class SellerOrdersService {
  private readonly orders: SellerOrderDetail[] = sellerOrderSeed.map(
    (order) => ({
      ...order,
      items: order.items.map((item) => ({ ...item })),
      notes: [...order.notes],
    }),
  );

  getSellerOrders(): SellerOrderQueueResponse {
    return {
      summary: {
        incoming: this.orders.filter((order) => order.status === 'incoming')
          .length,
        active: this.orders.filter((order) =>
          ['accepted', 'packed'].includes(order.status),
        ).length,
        ready: this.orders.filter((order) => order.status === 'ready').length,
      },
      orders: this.orders.map((order) => ({
        id: order.id,
        buyerName: order.buyerName,
        quantityLabel: order.quantityLabel,
        dueLabel: order.dueLabel,
        status: order.status,
        nextAction: order.nextAction,
      })),
    };
  }

  getSellerOrder(orderId: string): SellerOrderDetailResponse {
    return { order: this.findOrder(orderId) };
  }

  acceptSellerOrder(orderId: string): SellerOrderMutationResponse {
    return this.transitionOrder(orderId, 'accepted', 'Order accepted');
  }

  packSellerOrder(orderId: string): SellerOrderMutationResponse {
    return this.transitionOrder(orderId, 'packed', 'Order marked packed');
  }

  readySellerOrder(orderId: string): SellerOrderMutationResponse {
    return this.transitionOrder(orderId, 'ready', 'Order marked ready');
  }

  private transitionOrder(
    orderId: string,
    nextStatus: SellerOrderStatus,
    message: string,
  ): SellerOrderMutationResponse {
    const order = this.findOrder(orderId);
    assertTransition(order.status, nextStatus);
    order.status = nextStatus;
    order.nextAction = nextActionFor(nextStatus);
    order.notes = [...order.notes, message];
    return { order, message };
  }

  private findOrder(orderId: string) {
    const order = this.orders.find((item) => item.id === orderId);
    if (!order) {
      throw new NotFoundException({ message: 'Order not found', orderId });
    }
    return order;
  }
}
