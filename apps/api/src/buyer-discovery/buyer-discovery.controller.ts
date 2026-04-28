import { Controller, Get, Param, Query } from '@nestjs/common';
import type {
  BuyerCatalogQuery,
  BuyerCatalogResponse,
  BuyerCategoryBrowseQuery,
  BuyerCategoryBrowseResponse,
  BuyerProductDetailResponse,
  BuyerSearchQuery,
  BuyerSearchResponse,
} from '@fosholhaat/types';
import { BuyerDiscoveryService } from './buyer-discovery.service';

@Controller('buyer/catalog')
export class BuyerDiscoveryController {
  constructor(private readonly buyerDiscoveryService: BuyerDiscoveryService) {}

  @Get()
  async getCatalog(
    @Query() query: BuyerCatalogQuery,
  ): Promise<BuyerCatalogResponse> {
    return this.buyerDiscoveryService.getCatalog(query);
  }

  @Get('categories/:categorySlug')
  async getCategoryBrowse(
    @Param('categorySlug') categorySlug: string,
    @Query() query: BuyerCategoryBrowseQuery,
  ): Promise<BuyerCategoryBrowseResponse> {
    return this.buyerDiscoveryService.getCategoryBrowse(categorySlug, query);
  }

  @Get('search')
  async searchCatalog(
    @Query() query: BuyerSearchQuery,
  ): Promise<BuyerSearchResponse> {
    return this.buyerDiscoveryService.searchCatalog(query);
  }

  @Get('products/:productId')
  async getProductDetail(
    @Param('productId') productId: string,
    @Query('locale') locale?: 'bn' | 'en',
  ): Promise<BuyerProductDetailResponse> {
    return this.buyerDiscoveryService.getProductDetail(productId, locale);
  }
}
