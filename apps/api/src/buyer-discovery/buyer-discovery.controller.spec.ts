import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type {
  BuyerCatalogResponse,
  BuyerCategoryBrowseResponse,
  BuyerDiscoveryErrorResponse,
  BuyerProductDetailResponse,
  BuyerSearchResponse,
} from '@fosholhaat/types';
import request from 'supertest';
import { BuyerDiscoveryController } from './buyer-discovery.controller';
import { BuyerDiscoveryService } from './buyer-discovery.service';

describe('BuyerDiscoveryController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyerDiscoveryController],
      providers: [BuyerDiscoveryService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  function getServer() {
    return app.getHttpServer() as Parameters<typeof request>[0];
  }

  it('returns buyer catalog data', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog?locale=en')
      .expect(200);
    const body = response.body as BuyerCatalogResponse;

    expect(body).toMatchObject({
      workspace: {
        role: 'buyer',
        corridor: 'bogura-dhaka',
        locale: 'en',
      },
    });
    expect(body.categories).toHaveLength(3);
  });

  it('returns category-scoped results', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/categories/potato?locale=en')
      .expect(200);
    const body = response.body as BuyerCategoryBrowseResponse;

    expect(body.category).toMatchObject({ slug: 'potato' });
    expect(body.items.every((item) => item.commodity === 'potato')).toBe(true);
  });

  it('returns a structured category not-found response', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/categories/rice')
      .expect(404);
    const body = response.body as BuyerDiscoveryErrorResponse;

    expect(body).toMatchObject({
      error: {
        code: 'CATEGORY_NOT_FOUND',
        field: 'categorySlug',
        categorySlug: 'rice',
      },
    });
  });

  it('returns search results with total count', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/search?q=potato&locale=en')
      .expect(200);
    const body = response.body as BuyerSearchResponse;

    expect(body.query).toBe('potato');
    expect(body.totalResults).toBeGreaterThan(0);
  });

  it('returns a structured empty search response', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/search?q=%20%20%20')
      .expect(400);
    const body = response.body as BuyerDiscoveryErrorResponse;

    expect(body).toMatchObject({
      error: {
        code: 'EMPTY_SEARCH_QUERY',
        field: 'q',
      },
    });
  });

  it('returns product detail', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/products/PR-BD-101?locale=en')
      .expect(200);
    const body = response.body as BuyerProductDetailResponse;

    expect(body).toMatchObject({
      product: {
        id: 'PR-BD-101',
        commodity: 'potato',
      },
      purchaseOptions: {
        cartRoute: '/buyer/cart',
      },
    });
  });

  it('returns a structured product not-found response', async () => {
    const response = await request(getServer())
      .get('/buyer/catalog/products/missing')
      .expect(404);
    const body = response.body as BuyerDiscoveryErrorResponse;

    expect(body).toMatchObject({
      error: {
        code: 'PRODUCT_NOT_FOUND',
        productId: 'missing',
      },
    });
  });
});
