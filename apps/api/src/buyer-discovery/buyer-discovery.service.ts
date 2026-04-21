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
  BuyerDiscoveryCommodity,
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

type DiscoverySeed = {
  id: string;
  title: string;
  commodity: BuyerDiscoveryCommodity;
  packageLabel: Record<Locale, string>;
  price: number;
  priceLabel: Record<Locale, string>;
  stockRank: number;
  stockLabel: Record<Locale, string>;
  sellerLabel: Record<Locale, string>;
  verificationLabel: Record<Locale, string>;
  description: Record<Locale, string>;
  imageUrls: string[];
  supportsGroupBuy?: boolean;
};

const PRODUCT_SEED: DiscoverySeed[] = [
  {
    id: 'PR-BD-101',
    title: 'Bogura potato lot',
    commodity: 'potato',
    packageLabel: {
      en: 'Per 50 kg bag',
      bn: 'প্রতি ৫০ কেজি বস্তা',
    },
    price: 1420,
    priceLabel: {
      en: '৳1,420 per bag',
      bn: '৳১,৪২০ প্রতি বস্তা',
    },
    stockRank: 94,
    stockLabel: {
      en: '94 bags ready today',
      bn: 'আজ ৯৪ বস্তা প্রস্তুত',
    },
    sellerLabel: {
      en: 'Shibganj trade desk',
      bn: 'শিবগঞ্জ ট্রেড ডেস্ক',
    },
    verificationLabel: {
      en: 'Verified seller',
      bn: 'যাচাইকৃত বিক্রেতা',
    },
    description: {
      en: 'Fresh Bogura potato lot sorted for regular wholesale pickup.',
      bn: 'নিয়মিত পাইকারি তোলার জন্য বাছাই করা টাটকা বগুড়ার আলুর লট।',
    },
    imageUrls: ['https://images.example.com/potato-101.jpg'],
    supportsGroupBuy: true,
  },
  {
    id: 'PR-BD-102',
    title: 'Dhaka onion line',
    commodity: 'onion',
    packageLabel: {
      en: 'Per 40 kg bag',
      bn: 'প্রতি ৪০ কেজি বস্তা',
    },
    price: 1980,
    priceLabel: {
      en: '৳1,980 per bag',
      bn: '৳১,৯৮০ প্রতি বস্তা',
    },
    stockRank: 62,
    stockLabel: {
      en: '62 bags in active stock',
      bn: 'সক্রিয় স্টকে ৬২ বস্তা',
    },
    sellerLabel: {
      en: 'Kahaloo onion line',
      bn: 'কাহালু পেঁয়াজ লাইন',
    },
    verificationLabel: {
      en: 'Trusted corridor seller',
      bn: 'ভরসার করিডর বিক্রেতা',
    },
    description: {
      en: 'Medium-size onion lot for Dhaka-bound trade desks.',
      bn: 'ঢাকামুখী ট্রেড ডেস্কের জন্য মাঝারি সাইজের পেঁয়াজের লট।',
    },
    imageUrls: ['https://images.example.com/onion-102.jpg'],
  },
  {
    id: 'PR-BD-103',
    title: 'Mixed vegetables crate',
    commodity: 'vegetables',
    packageLabel: {
      en: 'Per mixed crate',
      bn: 'প্রতি মিশ্র ক্রেট',
    },
    price: 920,
    priceLabel: {
      en: '৳920 per crate',
      bn: '৳৯২০ প্রতি ক্রেট',
    },
    stockRank: 37,
    stockLabel: {
      en: '37 crates for same-day handoff',
      bn: 'একই দিনের হ্যান্ডঅফে ৩৭ ক্রেট',
    },
    sellerLabel: {
      en: 'Sadar vegetables cluster',
      bn: 'সদর সবজি ক্লাস্টার',
    },
    verificationLabel: {
      en: 'Hub checked stock',
      bn: 'হাবে দেখা স্টক',
    },
    description: {
      en: 'Mixed seasonal vegetables packed for fast comparison and pickup.',
      bn: 'দ্রুত তুলনা আর তোলার জন্য প্যাক করা মৌসুমি মিশ্র সবজি।',
    },
    imageUrls: ['https://images.example.com/vegetable-103.jpg'],
  },
  {
    id: 'PR-BD-104',
    title: 'Premium potato reserve',
    commodity: 'potato',
    packageLabel: {
      en: 'Per 50 kg bag',
      bn: 'প্রতি ৫০ কেজি বস্তা',
    },
    price: 1510,
    priceLabel: {
      en: '৳1,510 per bag',
      bn: '৳১,৫১০ প্রতি বস্তা',
    },
    stockRank: 28,
    stockLabel: {
      en: '28 bags in reserve stock',
      bn: 'রিজার্ভ স্টকে ২৮ বস্তা',
    },
    sellerLabel: {
      en: 'Gabtoli reserve lane',
      bn: 'গাবতলী রিজার্ভ লেন',
    },
    verificationLabel: {
      en: 'Quality checked lot',
      bn: 'গুণগত যাচাই করা লট',
    },
    description: {
      en: 'Higher grade potato lot for buyers who need tighter quality control.',
      bn: 'যাদের শক্ত মান-নিয়ন্ত্রণ দরকার তাদের জন্য উচ্চ গ্রেডের আলুর লট।',
    },
    imageUrls: ['https://images.example.com/potato-104.jpg'],
  },
];

@Injectable()
export class BuyerDiscoveryService {
  getCatalog(query: BuyerCatalogQuery = {}): BuyerCatalogResponse {
    const locale = this.resolveLocale(query.locale);
    this.assertCorridor(query.corridor);
    const sort = this.resolveSort(query.sort);
    this.assertPage(query.page);

    const highlights = this.sortProducts(
      PRODUCT_SEED.filter((product) =>
        query.categorySlug ? product.commodity === query.categorySlug : true,
      ),
      sort,
      locale,
    );

    return {
      workspace: {
        role: 'buyer',
        corridor: 'bogura-dhaka',
        locale,
      },
      categories: BUYER_DISCOVERY_CATEGORY_SLUGS.map((slug) => ({
        slug,
        label: this.getCategoryLabel(slug, locale),
        productCount: PRODUCT_SEED.filter(
          (product) => product.commodity === slug,
        ).length,
      })),
      highlights,
    };
  }

  getCategoryBrowse(
    categorySlug: string,
    query: BuyerCategoryBrowseQuery = {},
  ): BuyerCategoryBrowseResponse {
    const locale = this.resolveLocale(query.locale);
    const resolvedCategory = this.resolveCategorySlug(categorySlug);
    const sort = this.resolveSort(query.sort);
    this.assertPage(query.page);

    return {
      category: {
        slug: resolvedCategory,
        label: this.getCategoryLabel(resolvedCategory, locale),
      },
      locale,
      items: this.sortProducts(
        PRODUCT_SEED.filter(
          (product) => product.commodity === resolvedCategory,
        ),
        sort,
        locale,
      ),
    };
  }

  searchCatalog(query: BuyerSearchQuery): BuyerSearchResponse {
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
    const items = this.sortProducts(
      PRODUCT_SEED.filter((product) =>
        [
          product.title,
          product.commodity,
          product.sellerLabel.en,
          product.sellerLabel.bn,
          product.description.en,
          product.description.bn,
        ].some((value) => value.toLowerCase().includes(needle)),
      ),
      sort,
      locale,
    );

    return {
      query: searchTerm,
      locale,
      totalResults: items.length,
      items,
    };
  }

  getProductDetail(
    productId: string,
    localeInput?: Locale,
  ): BuyerProductDetailResponse {
    const locale = this.resolveLocale(localeInput);
    const product = PRODUCT_SEED.find((item) => item.id === productId);

    if (!product) {
      throw new NotFoundException(
        this.createError(
          'PRODUCT_NOT_FOUND',
          'Product not found.',
          undefined,
          productId,
        ),
      );
    }

    return {
      product: {
        id: product.id,
        title: product.title,
        commodity: product.commodity,
        description: product.description[locale],
        packageLabel: product.packageLabel[locale],
        priceLabel: product.priceLabel[locale],
        stockLabel: product.stockLabel[locale],
        verificationLabel: product.verificationLabel[locale],
        sellerLabel: product.sellerLabel[locale],
        imageUrls: product.imageUrls,
      },
      purchaseOptions: {
        canAddToCart: true,
        cartRoute: '/buyer/cart',
        groupBuyRoute: product.supportsGroupBuy
          ? '/buyer/group-buys'
          : undefined,
      },
      locale,
    };
  }

  private resolveLocale(locale: Locale | undefined): Locale {
    if (!locale) {
      return 'bn';
    }
    if (isLocale(locale)) {
      return locale;
    }
    throw new BadRequestException(
      this.createError('INVALID_LOCALE', 'Locale must be bn or en.', 'locale'),
    );
  }

  private assertCorridor(corridor?: string): void {
    if (!corridor || corridor === 'bogura-dhaka') {
      return;
    }
    throw new BadRequestException(
      this.createError(
        'INVALID_CORRIDOR',
        'Corridor must stay within bogura-dhaka.',
        'corridor',
      ),
    );
  }

  private resolveSort(sort?: string): BuyerDiscoverySort {
    if (!sort) {
      return 'relevance';
    }
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
    if (page === undefined) {
      return;
    }
    if (Number.isInteger(page) && page > 0) {
      return;
    }
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
        ? {
            potato: 'Potato',
            onion: 'Onion',
            vegetables: 'Vegetables',
          }
        : {
            potato: 'আলু',
            onion: 'পেঁয়াজ',
            vegetables: 'সবজি',
          };

    return `${copy.categoryTitlePrefix} ${labels[slug]}`;
  }

  private sortProducts(
    products: DiscoverySeed[],
    sort: BuyerDiscoverySort,
    locale: Locale,
  ): BuyerCatalogHighlight[] {
    const sorted = [...products];

    sorted.sort((left, right) => {
      switch (sort) {
        case 'price_asc':
          return left.price - right.price;
        case 'price_desc':
          return right.price - left.price;
        case 'stock_desc':
          return right.stockRank - left.stockRank;
        default:
          return left.id.localeCompare(right.id);
      }
    });

    return sorted.map((product) => ({
      productId: product.id,
      title: product.title,
      commodity: product.commodity,
      packageLabel: product.packageLabel[locale],
      priceLabel: product.priceLabel[locale],
      stockLabel: product.stockLabel[locale],
      sellerLabel: product.sellerLabel[locale],
      verificationLabel: product.verificationLabel[locale],
      imageUrl: product.imageUrls[0],
    }));
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
