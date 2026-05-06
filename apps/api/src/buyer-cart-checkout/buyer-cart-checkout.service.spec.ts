/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await */
import { BuyerCartCheckoutService } from './buyer-cart-checkout.service';
import { resolveCurrentBuyer } from '../auth/current-user';

jest.mock('../auth/current-user', () => ({
  resolveCurrentBuyer: jest.fn(),
}));

describe('BuyerCartCheckoutService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keeps group-buy checkout pending until target lock', async () => {
    (resolveCurrentBuyer as jest.Mock).mockResolvedValue({ id: 'buyer-1' });
    const line = {
      id: 'line-1',
      supplyLotId: 'lot-1',
      quantity: 10,
      unitPrice: 42,
      mode: 'GROUP',
      groupBuyId: 'gb-1',
      supplyLot: {
        business: null,
        seller: { fullName: 'Seller' },
        product: { id: 'prod-1', name: 'Onion' },
      },
    };
    const orderCreate = jest.fn();
    const prisma: any = {
      cart: {
        findFirst: jest.fn().mockResolvedValue({ id: 'cart-1', lines: [line] }),
        update: jest.fn(),
      },
      order: { create: orderCreate, updateMany: jest.fn() },
      groupBuyCommitment: { upsert: jest.fn() },
      groupBuy: {
        update: jest
          .fn()
          .mockResolvedValue({ id: 'gb-1', committedQty: 20, targetQty: 100 }),
      },
      $transaction: async (fn: any) =>
        fn({
          order: { create: orderCreate, updateMany: jest.fn() },
          groupBuyCommitment: { upsert: jest.fn() },
          groupBuy: {
            update: jest.fn().mockResolvedValue({
              id: 'gb-1',
              committedQty: 20,
              targetQty: 100,
            }),
          },
        }),
    };

    await new BuyerCartCheckoutService(prisma).submitCheckout('Bearer token');

    expect(orderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          orderType: 'GROUP',
          status: 'PENDING_GROUP_LOCK',
          paymentStatus: 'AUTHORIZED',
        }),
      }),
    );
  });

  it('sends single-buy checkout to seller review queue', async () => {
    (resolveCurrentBuyer as jest.Mock).mockResolvedValue({ id: 'buyer-1' });
    const line = {
      id: 'line-1',
      supplyLotId: 'lot-1',
      quantity: 1000,
      unitPrice: 45,
      mode: 'SINGLE',
      groupBuyId: null,
      supplyLot: {
        business: null,
        seller: { fullName: 'Seller' },
        product: { id: 'prod-1', name: 'Onion' },
      },
    };
    const orderCreate = jest.fn();
    const prisma: any = {
      cart: {
        findFirst: jest.fn().mockResolvedValue({ id: 'cart-1', lines: [line] }),
        update: jest.fn(),
      },
      $transaction: async (fn: any) =>
        fn({
          order: { create: orderCreate },
        }),
    };

    await new BuyerCartCheckoutService(prisma).submitCheckout('Bearer token');

    expect(orderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          orderType: 'SINGLE',
          status: 'PENDING_SELLER_REVIEW',
          paymentStatus: 'PENDING',
        }),
      }),
    );
  });

  it('moves group orders to seller review when target locks', async () => {
    (resolveCurrentBuyer as jest.Mock).mockResolvedValue({ id: 'buyer-1' });
    const line = {
      id: 'line-1',
      supplyLotId: 'lot-1',
      quantity: 80,
      unitPrice: 42,
      mode: 'GROUP',
      groupBuyId: 'gb-1',
      supplyLot: {
        business: null,
        seller: { fullName: 'Seller' },
        product: { id: 'prod-1', name: 'Onion' },
      },
    };
    const updateMany = jest.fn();
    const prisma: any = {
      cart: {
        findFirst: jest.fn().mockResolvedValue({ id: 'cart-1', lines: [line] }),
        update: jest.fn(),
      },
      $transaction: async (fn: any) =>
        fn({
          order: { create: jest.fn(), updateMany },
          groupBuyCommitment: { upsert: jest.fn() },
          groupBuy: {
            update: jest
              .fn()
              .mockResolvedValueOnce({
                id: 'gb-1',
                committedQty: 100,
                targetQty: 100,
              })
              .mockResolvedValueOnce({ id: 'gb-1' }),
          },
        }),
    };

    await new BuyerCartCheckoutService(prisma).submitCheckout('Bearer token');

    expect(updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { status: 'PENDING_SELLER_REVIEW' },
      }),
    );
  });
});
