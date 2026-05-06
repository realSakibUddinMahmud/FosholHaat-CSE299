/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access */
import { SellerOrdersService } from './seller-orders.service';
import { resolveCurrentSeller } from '../auth/current-user';

jest.mock('../auth/current-user', () => ({
  resolveCurrentSeller: jest.fn(),
}));

describe('SellerOrdersService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('only lists orders that have reached the seller queue', async () => {
    (resolveCurrentSeller as jest.Mock).mockResolvedValue({ id: 'seller-1' });
    const findMany = jest.fn().mockResolvedValue([]);
    const groupFindMany = jest.fn().mockResolvedValue([]);
    const prisma: any = {
      orderLine: { findMany },
      groupBuy: { findMany: groupFindMany },
    };

    await new SellerOrdersService(prisma).getSellerOrders('Bearer token');

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          supplyLot: { sellerId: 'seller-1' },
          order: {
            status: {
              in: [
                'PENDING_SELLER_REVIEW',
                'CONFIRMED',
                'IN_FULFILLMENT',
                'READY_FOR_HUB_HANDOFF',
                'HUB_RECEIVED',
                'SORTING',
                'READY_FOR_DISPATCH',
                'READY_FOR_BUYER_HANDOFF',
              ],
            },
          },
        }),
      }),
    );
    expect(groupFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'LIVE', supplyLot: { sellerId: 'seller-1' } },
      }),
    );
  });

  it('seller accept changes review order to confirmed', async () => {
    (resolveCurrentSeller as jest.Mock).mockResolvedValue({ id: 'seller-1' });
    const line = {
      id: 'line-1',
      orderId: 'order-1',
      order: {
        id: 'order-1',
        code: 'ORD-1',
        status: 'PENDING_SELLER_REVIEW',
        buyer: { fullName: 'Buyer' },
        orderType: 'SINGLE',
        paymentStatus: 'PENDING',
        total: 100,
        sellerHandoff: null,
        events: [],
      },
      supplyLot: {
        sellerId: 'seller-1',
        unit: 'kg',
        packageLabel: 'Bag',
        product: { name: 'Onion' },
      },
      quantity: 10,
      unitPrice: 10,
    };
    const prisma: any = {
      orderLine: {
        findUnique: jest
          .fn()
          .mockResolvedValueOnce(line)
          .mockResolvedValueOnce(line),
      },
      hub: { findFirst: jest.fn().mockResolvedValue({ id: 'hub-1' }) },
      order: { update: jest.fn().mockReturnValue('order-update') },
      sellerHandoff: { upsert: jest.fn().mockReturnValue('handoff-upsert') },
      orderEvent: { create: jest.fn().mockReturnValue('event-create') },
      $transaction: jest.fn().mockResolvedValue([]),
    };

    await new SellerOrdersService(prisma).acceptSellerOrder(
      'Bearer token',
      'line-1',
    );

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: { status: 'CONFIRMED' },
    });
    expect(prisma.sellerHandoff.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { orderId: 'order-1' } }),
    );
    expect(prisma.orderEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ eventType: 'SELLER_ACCEPTED' }),
      }),
    );
  });
});
