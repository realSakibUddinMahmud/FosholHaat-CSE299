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
  getCatalog(@Query() query: BuyerCatalogQuery): BuyerCatalogResponse {
    return this.buyerDiscoveryService.getCatalog(query);
  }

  @Get('categories/:categorySlug')
  getCategoryBrowse(
    @Param('categorySlug') categorySlug: string,
    @Query() query: BuyerCategoryBrowseQuery,
  ): BuyerCategoryBrowseResponse {
    return this.buyerDiscoveryService.getCategoryBrowse(categorySlug, query);
  }

  @Get('search')
  searchCatalog(@Query() query: BuyerSearchQuery): BuyerSearchResponse {
    return this.buyerDiscoveryService.searchCatalog(query);
  }

  @Get('products/:productId')
  getProductDetail(
    @Param('productId') productId: string,
    @Query('locale') locale?: 'bn' | 'en',
  ): BuyerProductDetailResponse {
    return this.buyerDiscoveryService.getProductDetail(productId, locale);
  }
}
