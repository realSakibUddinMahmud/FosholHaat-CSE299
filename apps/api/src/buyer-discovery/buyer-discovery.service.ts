/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  BuyerCatalogHighlight,
  BuyerCatalogQuery,
  BuyerCatalogResponse,
  BuyerCategoryBrowseQuery,
  BuyerCategoryBrowseResponse,
  BuyerDiscoveryCategorySlug,
  BuyerDiscoveryErrorResponse,
  BuyerDiscoverySort,
  BuyerProductDetailResponse,
  BuyerSearchQuery,
  BuyerSearchResponse,
  Locale,
} from '@fosholhaat/types';
import {
  BUYER_DISCOVERY_CATEGORY_SLUGS,
  BUYER_DISCOVERY_SORTS,
  getBuyerDiscoveryCopy,
  isLocale,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuyerDiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(
    query: BuyerCatalogQuery = {},
  ): Promise<BuyerCatalogResponse> {
    const locale = this.resolveLocale(query.locale);
    this.assertCorridor(query.corridor);
    const sort = this.resolveSort(query.sort);
    this.assertPage(query.page);

    const where: any = {
      status: { in: ['ACTIVE', 'SCHEDULED', 'LOW_STOCK', 'ORDERED'] },
    };
    if (query.categorySlug) {
      where.product = { category: query.categorySlug };
    }

    const supplyLots = await this.prisma.supplyLot.findMany({
      where,
      include: { product: true, seller: true, business: true, groupBuys: true },
    });

    const allLots = await this.prisma.supplyLot.findMany({
      where: {
        status: { in: ['ACTIVE', 'SCHEDULED', 'LOW_STOCK', 'ORDERED'] },
      },
      include: { product: true },
    });

    const highlights = this.sortProducts(supplyLots as any, sort, locale);

    return {
      workspace: {
        role: 'buyer',
        corridor: 'bogura-dhaka',
        locale,
      },
      categories: BUYER_DISCOVERY_CATEGORY_SLUGS.map((slug) => ({
        slug,
        label: this.getCategoryLabel(slug, locale),
        productCount: allLots.filter((l) => l.product.category === slug).length,
      })),
      highlights,
    };
  }

  async getCategoryBrowse(
    categorySlug: string,
    query: BuyerCategoryBrowseQuery = {},
  ): Promise<BuyerCategoryBrowseResponse> {
    const locale = this.resolveLocale(query.locale);
    const resolvedCategory = this.resolveCategorySlug(categorySlug);
    const sort = this.resolveSort(query.sort);
    this.assertPage(query.page);

    const items = await this.prisma.supplyLot.findMany({
      where: {
        status: { in: ['ACTIVE', 'SCHEDULED', 'LOW_STOCK', 'ORDERED'] },
        product: { category: resolvedCategory },
      },
      include: { product: true, seller: true, business: true, groupBuys: true },
    });

    return {
      category: {
        slug: resolvedCategory,
        label: this.getCategoryLabel(resolvedCategory, locale),
      },
      locale,
      items: this.sortProducts(items as any, sort, locale),
    };
  }

  async searchCatalog(query: BuyerSearchQuery): Promise<BuyerSearchResponse> {
    const locale = this.resolveLocale(query.locale);
    const searchTerm = query?.q?.trim();
    const sort = this.resolveSort(query.sort);
    this.assertPage(query.page);

    if (!searchTerm) {
      throw new BadRequestException(
        this.createError(
          'EMPTY_SEARCH_QUERY',
          'Add a search term before requesting search results.',
          'q',
        ),
      );
    }

    const needle = searchTerm.toLowerCase();

    const allLots = await this.prisma.supplyLot.findMany({
      where: {
        status: { in: ['ACTIVE', 'SCHEDULED', 'LOW_STOCK', 'ORDERED'] },
      },
      include: { product: true, seller: true, business: true, groupBuys: true },
    });

    const items = allLots.filter((lot: any) => {
      const sellerName = lot.business?.name || lot.seller.fullName;
      return (
        lot.product.name.toLowerCase().includes(needle) ||
        lot.product.category.toLowerCase().includes(needle) ||
        sellerName.toLowerCase().includes(needle) ||
        lot.commodityLabel.toLowerCase().includes(needle)
      );
    });

    const sortedItems = this.sortProducts(items as any, sort, locale);

    return {
      query: searchTerm,
      locale,
      totalResults: sortedItems.length,
      items: sortedItems,
    };
  }

  async getProductDetail(
    productId: string,
    localeInput?: Locale,
  ): Promise<BuyerProductDetailResponse> {
    const locale = this.resolveLocale(localeInput);

    const lot = await this.prisma.supplyLot.findUnique({
      where: { id: productId },
      include: {
        product: true,
        seller: true,
        business: true,
        groupBuys: { where: { status: 'LIVE' } },
      },
    });

    if (!lot) {
      throw new NotFoundException(
        this.createError(
          'PRODUCT_NOT_FOUND',
          'Product not found.',
          undefined,
          productId,
        ),
      );
    }

    const sellerName = lot.business?.name || lot.seller.fullName;

    return {
      product: {
        id: lot.id,
        title: `${lot.product.name} ${lot.commodityLabel}`,
        commodity: lot.product.category as any,
        description: `Grade: ${lot.gradeLabel}. Fresh supply from ${sellerName}.`,
        packageLabel: lot.packageLabel,
        priceLabel: `৳${lot.askingPrice} per ${lot.unit}`,
        stockLabel: `${lot.availableQty} ${lot.unit} ready`,
        verificationLabel: 'Verified seller',
        sellerLabel: sellerName,
        imageUrls: lot.product.imageUrl ? [lot.product.imageUrl] : [],
      },
      purchaseOptions: {
        canAddToCart: lot.availableQty > 0,
        cartRoute: '/buyer/cart',
        groupBuyRoute:
          lot.groupBuys.length > 0 ? '/buyer/group-buys' : undefined,
      },
      locale,
    };
  }

  private resolveLocale(locale: Locale | undefined): Locale {
    if (!locale) return 'bn';
    if (isLocale(locale)) return locale;
    throw new BadRequestException(
      this.createError('INVALID_LOCALE', 'Locale must be bn or en.', 'locale'),
    );
  }

  private assertCorridor(corridor?: string): void {
    if (!corridor || corridor === 'bogura-dhaka') return;
    throw new BadRequestException(
      this.createError(
        'INVALID_CORRIDOR',
        'Corridor must stay within bogura-dhaka.',
        'corridor',
      ),
    );
  }

  private resolveSort(sort?: string): BuyerDiscoverySort {
    if (!sort) return 'relevance';
    if ((BUYER_DISCOVERY_SORTS as readonly string[]).includes(sort)) {
      return sort as BuyerDiscoverySort;
    }
    throw new BadRequestException(
      this.createError(
        'INVALID_SORT',
        'Sort must stay inside the approved discovery sort set.',
        'sort',
      ),
    );
  }

  private assertPage(page?: number): void {
    if (page === undefined) return;
    if (Number.isInteger(page) && page > 0) return;
    throw new BadRequestException(
      this.createError(
        'INVALID_PAGE',
        'Page must be a positive integer.',
        'page',
      ),
    );
  }

  private resolveCategorySlug(
    categorySlug: string,
  ): BuyerDiscoveryCategorySlug {
    if (
      (BUYER_DISCOVERY_CATEGORY_SLUGS as readonly string[]).includes(
        categorySlug,
      )
    ) {
      return categorySlug as BuyerDiscoveryCategorySlug;
    }
    throw new NotFoundException(
      this.createError(
        'CATEGORY_NOT_FOUND',
        'Category not found.',
        'categorySlug',
        undefined,
        categorySlug,
      ),
    );
  }

  private getCategoryLabel(
    slug: BuyerDiscoveryCategorySlug,
    locale: Locale,
  ): string {
    const copy = getBuyerDiscoveryCopy(locale);
    const labels: Record<BuyerDiscoveryCategorySlug, string> =
      locale === 'en'
        ? { potato: 'Potato', onion: 'Onion', vegetables: 'Vegetables' }
        : { potato: 'আলু', onion: 'পেঁয়াজ', vegetables: 'সবজি' };

    return `${copy.categoryTitlePrefix} ${labels[slug]}`;
  }

  private sortProducts(
    lots: any[],
    sort: BuyerDiscoverySort,
    locale: Locale,
  ): BuyerCatalogHighlight[] {
    const sorted = [...lots];

    sorted.sort((left, right) => {
      switch (sort) {
        case 'price_asc':
          return left.askingPrice - right.askingPrice;
        case 'price_desc':
          return right.askingPrice - left.askingPrice;
        case 'stock_desc':
          return right.availableQty - left.availableQty;
        default:
          return left.id.localeCompare(right.id);
      }
    });

    return sorted.map((lot) => {
      const sellerName = lot.business?.name || lot.seller.fullName;
      return {
        productId: lot.id,
        title: `${lot.product.name} ${lot.commodityLabel}`,
        commodity: lot.product.category,
        packageLabel: lot.packageLabel,
        priceLabel: `৳${lot.askingPrice} per ${lot.unit}`,
        stockLabel: `${lot.availableQty} ${lot.unit} ready`,
        sellerLabel: sellerName,
        verificationLabel: 'Verified seller',
        imageUrl: lot.product.imageUrl || '',
      };
    });
  }

  private createError(
    code: BuyerDiscoveryErrorResponse['error']['code'],
    message: string,
    field?: BuyerDiscoveryErrorResponse['error']['field'],
    productId?: string,
    categorySlug?: string,
  ): BuyerDiscoveryErrorResponse {
    return { error: { code, message, field, productId, categorySlug } };
  }
}
