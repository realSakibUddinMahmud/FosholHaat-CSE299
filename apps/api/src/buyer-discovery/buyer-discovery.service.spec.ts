import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BuyerDiscoveryService } from './buyer-discovery.service';

describe('BuyerDiscoveryService', () => {
  let service: BuyerDiscoveryService;

  beforeEach(() => {
    service = new BuyerDiscoveryService();
  });

  it('returns the buyer catalog workspace', () => {
    const response = service.getCatalog({ locale: 'en' });

    expect(response.workspace).toEqual({
      role: 'buyer',
      corridor: 'bogura-dhaka',
      locale: 'en',
    });
    expect(response.categories).toHaveLength(3);
    expect(response.highlights[0]?.productId).toBe('PR-BD-101');
  });

  it('filters a category browse response', () => {
    const response = service.getCategoryBrowse('potato', { locale: 'en' });

    expect(response.category.slug).toBe('potato');
    expect(response.items.every((item) => item.commodity === 'potato')).toBe(
      true,
    );
  });

  it('rejects an unsupported category slug', () => {
    expect(() => service.getCategoryBrowse('rice')).toThrow(NotFoundException);
  });

  it('returns search results with a total count', () => {
    const response = service.searchCatalog({ q: 'onion', locale: 'en' });

    expect(response.query).toBe('onion');
    expect(response.totalResults).toBeGreaterThan(0);
    expect(response.items[0]?.commodity).toBe('onion');
  });

  it('rejects an empty search query', () => {
    expect(() => service.searchCatalog({ q: '   ', locale: 'en' })).toThrow(
      BadRequestException,
    );
  });

  it('returns product detail with downstream routes', () => {
    const response = service.getProductDetail('PR-BD-101', 'en');

    expect(response.product.id).toBe('PR-BD-101');
    expect(response.purchaseOptions.cartRoute).toBe('/buyer/cart');
    expect(response.purchaseOptions.groupBuyRoute).toBe('/buyer/group-buys');
  });

  it('rejects an unknown product id', () => {
    expect(() => service.getProductDetail('missing', 'en')).toThrow(
      NotFoundException,
    );
  });
});
