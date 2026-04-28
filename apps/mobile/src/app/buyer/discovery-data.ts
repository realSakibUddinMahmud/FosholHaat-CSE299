import type {
  BuyerCatalogHighlight,
  BuyerCatalogResponse,
  BuyerCategoryBrowseResponse,
  BuyerDiscoveryCategorySlug,
  BuyerProductDetailResponse,
  BuyerSearchResponse,
  Locale,
} from "@fosholhaat/types";

type MobileDiscoverySeed = {
  id: string;
  title: string;
  commodity: BuyerDiscoveryCategorySlug;
  packageLabel: Record<Locale, string>;
  priceValue: number;
  stockCount: number;
  stockUnit: Record<Locale, string>;
  sellerLabel: Record<Locale, string>;
  verificationLabel: Record<Locale, string>;
  description: Record<Locale, string>;
  imageLabel: Record<Locale, string>;
  supportsGroupBuy?: boolean;
};

export function getFirstDiscoveryParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const PRODUCT_SEED: MobileDiscoverySeed[] = [
  {
    id: "PR-BD-101",
    title: "Bogura potato lot",
    commodity: "potato",
    packageLabel: { en: "50 kg bag", bn: "৫০ কেজি বস্তা" },
    priceValue: 1420,
    stockCount: 94,
    stockUnit: { en: "bags ready today", bn: "বস্তা আজ প্রস্তুত" },
    sellerLabel: { en: "Shibganj trade desk", bn: "শিবগঞ্জ ট্রেড ডেস্ক" },
    verificationLabel: { en: "Verified seller", bn: "যাচাইকৃত বিক্রেতা" },
    description: {
      en: "Fresh Bogura potato lot sorted for regular wholesale pickup.",
      bn: "নিয়মিত পাইকারি তোলার জন্য বাছাই করা টাটকা বগুড়ার আলুর লট।",
    },
    imageLabel: { en: "Potato lot", bn: "আলুর লট" },
    supportsGroupBuy: true,
  },
  {
    id: "PR-BD-102",
    title: "Dhaka onion line",
    commodity: "onion",
    packageLabel: { en: "40 kg bag", bn: "৪০ কেজি বস্তা" },
    priceValue: 1980,
    stockCount: 62,
    stockUnit: { en: "bags in active stock", bn: "বস্তা সক্রিয় স্টকে" },
    sellerLabel: { en: "Kahaloo onion line", bn: "কাহালু পেঁয়াজ লাইন" },
    verificationLabel: { en: "Trusted corridor seller", bn: "ভরসার করিডর বিক্রেতা" },
    description: {
      en: "Medium-size onion lot for Dhaka-bound trade desks.",
      bn: "ঢাকামুখী ট্রেড ডেস্কের জন্য মাঝারি সাইজের পেঁয়াজের লট।",
    },
    imageLabel: { en: "Onion line", bn: "পেঁয়াজের লাইন" },
  },
  {
    id: "PR-BD-103",
    title: "Mixed vegetables crate",
    commodity: "vegetables",
    packageLabel: { en: "Mixed crate", bn: "মিশ্র ক্রেট" },
    priceValue: 920,
    stockCount: 37,
    stockUnit: { en: "crates for same-day handoff", bn: "ক্রেট একই দিনের হ্যান্ডঅফে" },
    sellerLabel: { en: "Sadar vegetables cluster", bn: "সদর সবজি ক্লাস্টার" },
    verificationLabel: { en: "Hub checked stock", bn: "হাবে দেখা স্টক" },
    description: {
      en: "Mixed seasonal vegetables packed for fast comparison and pickup.",
      bn: "দ্রুত তুলনা আর তোলার জন্য প্যাক করা মৌসুমি মিশ্র সবজি।",
    },
    imageLabel: { en: "Vegetables crate", bn: "সবজির ক্রেট" },
  },
  {
    id: "PR-BD-104",
    title: "Premium potato reserve",
    commodity: "potato",
    packageLabel: { en: "50 kg reserve bag", bn: "৫০ কেজি রিজার্ভ বস্তা" },
    priceValue: 1510,
    stockCount: 28,
    stockUnit: { en: "bags in reserve stock", bn: "বস্তা রিজার্ভ স্টকে" },
    sellerLabel: { en: "Gabtoli reserve lane", bn: "গাবতলী রিজার্ভ লেন" },
    verificationLabel: { en: "Quality checked lot", bn: "গুণগত যাচাই করা লট" },
    description: {
      en: "Higher grade potato lot for tighter quality control.",
      bn: "যাদের শক্ত মান-নিয়ন্ত্রণ দরকার তাদের জন্য উচ্চ গ্রেডের আলুর লট।",
    },
    imageLabel: { en: "Premium potato lot", bn: "প্রিমিয়াম আলুর লট" },
  },
];

function formatMoney(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function highlightFromSeed(
  product: MobileDiscoverySeed,
  locale: Locale
): BuyerCatalogHighlight {
  return {
    productId: product.id,
    title: product.title,
    commodity: product.commodity,
    packageLabel: product.packageLabel[locale],
    priceLabel: `${formatMoney(product.priceValue, locale)} / ${product.packageLabel[locale]}`,
    stockLabel: `${new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(product.stockCount)} ${product.stockUnit[locale]}`,
    sellerLabel: product.sellerLabel[locale],
    verificationLabel: product.verificationLabel[locale],
    imageUrl: product.imageLabel[locale],
  };
}

function categoryLabel(slug: BuyerDiscoveryCategorySlug, locale: Locale) {
  const labels =
    locale === "en"
      ? ({
          potato: "Potato",
          onion: "Onion",
          vegetables: "Vegetables",
        } satisfies Record<BuyerDiscoveryCategorySlug, string>)
      : ({
          potato: "আলু",
          onion: "পেঁয়াজ",
          vegetables: "সবজি",
        } satisfies Record<BuyerDiscoveryCategorySlug, string>);
  return labels[slug];
}

export function getBuyerCatalogFixture(locale: Locale): BuyerCatalogResponse {
  const slugs: BuyerDiscoveryCategorySlug[] = ["potato", "onion", "vegetables"];

  return {
    workspace: { role: "buyer", corridor: "bogura-dhaka", locale },
    categories: slugs.map((slug) => ({
      slug,
      label: categoryLabel(slug as BuyerDiscoveryCategorySlug, locale),
      productCount: PRODUCT_SEED.filter((product) => product.commodity === slug).length,
    })),
    highlights: PRODUCT_SEED.map((product) => highlightFromSeed(product, locale)),
  };
}

export function getBuyerCategoryFixture(
  categorySlug: string,
  locale: Locale
): BuyerCategoryBrowseResponse | null {
  if (!["potato", "onion", "vegetables"].includes(categorySlug)) {
    return null;
  }

  const slug = categorySlug as BuyerDiscoveryCategorySlug;
  return {
    category: { slug, label: categoryLabel(slug, locale) },
    locale,
    items: PRODUCT_SEED.filter((product) => product.commodity === slug).map((product) =>
      highlightFromSeed(product, locale)
    ),
  };
}

export function getBuyerSearchFixture(query: string, locale: Locale): BuyerSearchResponse | null {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const needle = trimmed.toLowerCase();
  const items = PRODUCT_SEED.filter((product) =>
    [
      product.title,
      product.commodity,
      product.sellerLabel.en,
      product.sellerLabel.bn,
      product.description.en,
      product.description.bn,
    ].some((value) => value.toLowerCase().includes(needle))
  ).map((product) => highlightFromSeed(product, locale));

  return {
    query: trimmed,
    locale,
    totalResults: items.length,
    items,
  };
}

export function getBuyerProductFixture(
  productId: string,
  locale: Locale
): BuyerProductDetailResponse | null {
  const product = PRODUCT_SEED.find((item) => item.id === productId);
  if (!product) {
    return null;
  }

  return {
    product: {
      id: product.id,
      title: product.title,
      commodity: product.commodity,
      description: product.description[locale],
      packageLabel: product.packageLabel[locale],
      priceLabel: `${formatMoney(product.priceValue, locale)} / ${product.packageLabel[locale]}`,
      stockLabel: `${new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD").format(product.stockCount)} ${product.stockUnit[locale]}`,
      verificationLabel: product.verificationLabel[locale],
      sellerLabel: product.sellerLabel[locale],
      imageUrls: [product.imageLabel[locale]],
    },
    purchaseOptions: {
      canAddToCart: true,
      cartRoute: "/buyer/cart",
      groupBuyRoute: product.supportsGroupBuy ? "/buyer/group-buys" : undefined,
    },
    locale,
  };
}
