import { Test, TestingModule } from '@nestjs/testing';
import { BuyerGroupBuyService } from './buyer-group-buy.service';
describe('BuyerGroupBuyService', () => {
  let service: BuyerGroupBuyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerGroupBuyService],
    }).compile();

    service = module.get<BuyerGroupBuyService>(BuyerGroupBuyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGroupBuys', () => {
    it('should return an array of group buy summaries', () => {
      const result = service.getGroupBuys();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).not.toHaveProperty('description');
      expect(result[0].status).toBe('ACTIVE');
    });
  });

  describe('getGroupBuyDetail', () => {
    it('should return a group buy detail for a valid ID', () => {
      const result = service.getGroupBuyDetail('gb-1');
      expect(result).toBeDefined();
      expect(result?.id).toBe('gb-1');
      expect(result).toHaveProperty('description');
    });

    it('should return undefined for an invalid ID', () => {
      const result = service.getGroupBuyDetail('invalid-id');
      expect(result).toBeUndefined();
    });
  });

  describe('joinGroupBuy', () => {
    it('should successfully join an active group buy', () => {
      const initialDetail = service.getGroupBuyDetail('gb-1');
      const initialQuantity = initialDetail?.currentQuantity || 0;

      const result = service.joinGroupBuy('gb-1', { quantity: 10 });
      expect(result.success).toBe(true);
      expect(result.orderId).toBeDefined();

      const updatedDetail = service.getGroupBuyDetail('gb-1');
      expect(updatedDetail?.currentQuantity).toBe(initialQuantity + 10);
    });

    it('should fail if group buy is not found', () => {
      const result = service.joinGroupBuy('invalid-id', { quantity: 10 });
      expect(result.success).toBe(false);
      expect(result.message).toBe('Group buy not found');
    });

    it('should fail for non-positive quantity', () => {
      const result = service.joinGroupBuy('gb-1', { quantity: 0 });
      expect(result.success).toBe(false);
      expect(result.message).toBe('Join quantity must be positive');
    });
  });
});
