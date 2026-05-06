/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await */
import { BuyerGroupBuyService } from './buyer-group-buy.service';
import { resolveCurrentBuyer } from '../auth/current-user';

jest.mock('../auth/current-user', () => ({
  resolveCurrentBuyer: jest.fn(),
}));

describe('BuyerGroupBuyService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('adds group-buy quantity to cart without creating a commitment', async () => {
    (resolveCurrentBuyer as jest.Mock).mockResolvedValue({
      id: 'buyer-1',
      locale: 'en',
    });
    const cartLineCreate = jest.fn();
    const commitmentCreate = jest.fn();
    const prisma: any = {
      groupBuy: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'gb-1',
          code: 'GB-1',
          supplyLotId: 'lot-1',
          committedQty: 0,
          targetQty: 100,
          minimumJoinQty: 1,
          maximumJoinQty: null,
          groupPrice: 42,
          status: 'LIVE',
          supplyLot: { groupBuyEnabled: true },
        }),
      },
      $transaction: async (fn: any) =>
        fn({
          cart: {
            findFirst: jest.fn().mockResolvedValue({ id: 'cart-1' }),
            create: jest.fn(),
          },
          cartLine: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: cartLineCreate,
            update: jest.fn(),
          },
          groupBuyCommitment: { create: commitmentCreate },
        }),
    };

    const result = await new BuyerGroupBuyService(prisma).joinGroupBuy(
      'Bearer token',
      'GB-1',
      { quantity: 10 },
    );

    expect(result.success).toBe(true);
    expect(cartLineCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        mode: 'GROUP',
        groupBuyId: 'gb-1',
        quantity: 10,
      }),
    });
    expect(commitmentCreate).not.toHaveBeenCalled();
  });

  it('rejects group-buy quantities below the seller minimum', async () => {
    const prisma: any = {
      groupBuy: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'gb-1',
          supplyLotId: 'lot-1',
          committedQty: 0,
          targetQty: 1000,
          minimumJoinQty: 50,
          maximumJoinQty: null,
          groupPrice: 42,
          status: 'LIVE',
          supplyLot: { groupBuyEnabled: true },
        }),
      },
      $transaction: jest.fn(),
    };

    const result = await new BuyerGroupBuyService(prisma).joinGroupBuy(
      'Bearer token',
      'GB-1',
      { quantity: 1 },
    );

    expect(result.success).toBe(false);
    expect(result.message).toContain('50');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
