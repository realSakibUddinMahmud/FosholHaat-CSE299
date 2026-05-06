import type { Locale } from "@fosholhaat/types";

export type BuyerDiscoveryCategorySlug = "potato" | "onion" | "vegetables";

export type BuyerDiscoveryCategory = {
  slug: BuyerDiscoveryCategorySlug;
  label: Record<Locale, string>;
  blurb: Record<Locale, string>;
};

export type BuyerDiscoveryProduct = {
  productId: string;
  categorySlug: BuyerDiscoveryCategorySlug;
  name: Record<Locale, string>;
  sellerName: string;
  corridor: string;
  location: string;
  packSize: Record<Locale, string>;
  pricePerPack: number;
  availablePacks: number;
  minOrder: Record<Locale, string>;
  trustTags: Record<Locale, string[]>;
  summary: Record<Locale, string>;
  imageUrl?: string;
  groupBuyId?: string;
  singleMinQty?: number;
  singleMaxQty?: number;
};

export const BUYER_DISCOVERY_CATEGORIES: BuyerDiscoveryCategory[] = [
  {
    slug: "potato",
    label: { en: "Potato", bn: "আলু" },
    blurb: {
      en: "Fresh lots with clear pack sizes.",
      bn: "পরিষ্কার প্যাক সাইজসহ তাজা লট।",
    },
  },
  {
    slug: "onion",
    label: { en: "Onion", bn: "পেঁয়াজ" },
    blurb: {
      en: "Grade-focused onion offers.",
      bn: "গ্রেডভিত্তিক পেঁয়াজের অফার।",
    },
  },
  {
    slug: "vegetables",
    label: { en: "Vegetables", bn: "সবজি" },
    blurb: {
      en: "Mixed veg stock for fast buying.",
      bn: "দ্রুত কেনার জন্য মিশ্র সবজির স্টক।",
    },
  },
];

export const BUYER_DISCOVERY_PRODUCTS: BuyerDiscoveryProduct[] = [
  {
    productId: "potato-kazi-001",
    categorySlug: "potato",
    name: { en: "Potato, white grade", bn: "আলু, সাদা গ্রেড" },
    sellerName: "Kazi Traders",
    corridor: "Bogura -> Dhaka",
    location: "Kalitola hub",
    packSize: { en: "1 sack = 45 kg", bn: "১ বস্তা = ৪৫ কেজি" },
    pricePerPack: 820,
    availablePacks: 120,
    minOrder: { en: "Min 10 sacks", bn: "সর্বনিম্ন ১০ বস্তা" },
    trustTags: {
      en: ["Hub checked", "Group-buy ready", "Same-day pickup"],
      bn: ["হাবে যাচাই", "গ্রুপ কেনা যাবে", "আজই তোলা যাবে"],
    },
    summary: {
      en: "Strong wash quality with steady load availability for trade buyers.",
      bn: "বাণিজ্যিক ক্রেতাদের জন্য স্থির লোডসহ ভালো ধোয়ার মান।",
    },
  },
  {
    productId: "onion-rahman-002",
    categorySlug: "onion",
    name: { en: "Onion, medium red", bn: "পেঁয়াজ, মাঝারি লাল" },
    sellerName: "Rahman Supply",
    corridor: "Bogura -> Dhaka",
    location: "Shibganj zone",
    packSize: { en: "1 bag = 30 kg", bn: "১ বস্তা = ৩০ কেজি" },
    pricePerPack: 1450,
    availablePacks: 82,
    minOrder: { en: "Min 8 bags", bn: "সর্বনিম্ন ৮ বস্তা" },
    trustTags: {
      en: ["Grade A", "Price locked", "Easy resupply"],
      bn: ["গ্রেড এ", "দাম লক", "সহজ রিসাপ্লাই"],
    },
    summary: {
      en: "Locked pricing and a clean grade split for repeat buyers.",
      bn: "বারবার কেনা ক্রেতাদের জন্য লক করা দাম ও পরিষ্কার গ্রেড বিভাজন।",
    },
  },
  {
    productId: "veg-apon-003",
    categorySlug: "vegetables",
    name: {
      en: "Vegetable mix, market crate",
      bn: "সবজি মিক্স, মার্কেট ক্রেট",
    },
    sellerName: "Apon Market Link",
    corridor: "Bogura -> Dhaka",
    location: "Nandigram yard",
    packSize: { en: "1 crate = 18 kg", bn: "১ ক্রেট = ১৮ কেজি" },
    pricePerPack: 860,
    availablePacks: 96,
    minOrder: { en: "Min 12 crates", bn: "সর্বনিম্ন ১২ ক্রেট" },
    trustTags: {
      en: ["Pre-sorted", "Dispatch ready", "Group buying"],
      bn: ["আগেই বাছাই", "ডিসপ্যাচ প্রস্তুত", "গ্রুপ কেনা"],
    },
    summary: {
      en: "Fast-moving mixed vegetables for small wholesale orders.",
      bn: "ছোট পাইকারি অর্ডারের জন্য দ্রুত চলা মিশ্র সবজি।",
    },
  },
  {
    productId: "potato-farid-004",
    categorySlug: "potato",
    name: { en: "Potato, large pack", bn: "আলু, বড় প্যাক" },
    sellerName: "Farid Agro Line",
    corridor: "Bogura -> Dhaka",
    location: "Sherpur depot",
    packSize: { en: "1 sack = 50 kg", bn: "১ বস্তা = ৫০ কেজি" },
    pricePerPack: 860,
    availablePacks: 54,
    minOrder: { en: "Min 6 sacks", bn: "সর্বনিম্ন ৬ বস্তা" },
    trustTags: {
      en: ["Hub verified", "Night load", "Stable stock"],
      bn: ["হাব যাচাই", "রাতের লোড", "স্থির স্টক"],
    },
    summary: {
      en: "Large packs suited to buyers who want fewer touches per order.",
      bn: "কম হাতবদল চাওয়া ক্রেতাদের জন্য বড় প্যাক।",
    },
  },
];

export const BUYER_DISCOVERY_COPY: Record<
  Locale,
  {
    badge: string;
    title: string;
    lead: string;
    searchLabel: string;
    searchPlaceholder: string;
    categoryLabel: string;
    resultsLabel: string;
    corridorLabel: string;
    trustTitle: string;
    trustBody: string;
    detailBadge: string;
    detailActionLabel: string;
    relatedTitle: string;
    backLabel: string;
    emptyTitle: string;
    emptyBody: string;
    sellerLabel: string;
    packSizeLabel: string;
    minimumOrderLabel: string;
    availabilityLabel: string;
    allLabel: string;
  }
> = {
  en: {
    badge: "Buyer discovery",
    title: "Find stock before the market moves",
    lead: "Browse trusted offers from the Bogura to Dhaka corridor. Compare price, pack size, and availability in one view.",
    searchLabel: "Search stock",
    searchPlaceholder: "Search potato, onion, seller, or location",
    categoryLabel: "Categories",
    resultsLabel: "Live offers",
    corridorLabel: "Corridor",
    trustTitle: "Why this view is safe",
    trustBody:
      "Only browse-ready listings are shown here. No cart mutation or checkout flow lives in this slice.",
    detailBadge: "Product detail",
    detailActionLabel: "View details",
    relatedTitle: "More stock like this",
    backLabel: "Back to discovery",
    emptyTitle: "No matching stock",
    emptyBody: "Clear the filters or try a different search term.",
    sellerLabel: "Seller",
    packSizeLabel: "Pack size",
    minimumOrderLabel: "Minimum order",
    availabilityLabel: "Availability",
    allLabel: "All",
  },
  bn: {
    badge: "ক্রেতা ডিসকভারি",
    title: "বাজার নড়ার আগেই স্টক দেখুন",
    lead: "বগুড়া থেকে ঢাকার করিডরের ভেতর নির্ভরযোগ্য অফার দেখুন। দাম, প্যাক সাইজ, আর অ্যাভেইলেবিলিটি এক ভিউতে তুলনা করুন।",
    searchLabel: "স্টক খুঁজুন",
    searchPlaceholder: "আলু, পেঁয়াজ, বিক্রেতা, বা এলাকা লিখুন",
    categoryLabel: "ক্যাটাগরি",
    resultsLabel: "লাইভ অফার",
    corridorLabel: "করিডর",
    trustTitle: "এই ভিউ কেন নিরাপদ",
    trustBody:
      "এখানে শুধু ব্রাউজ-রেডি লিস্টিং দেখানো হয়। এই স্লাইসে কার্ট মিউটেশন বা চেকআউট ফ্লো নেই।",
    detailBadge: "পণ্যের বিস্তারিত",
    detailActionLabel: "বিস্তারিত দেখুন",
    relatedTitle: "এই ধরনের আরও স্টক",
    backLabel: "ডিসকভারিতে ফিরুন",
    emptyTitle: "মিলছে না",
    emptyBody: "ফিল্টার মুছুন বা অন্য শব্দ দিয়ে খুঁজুন।",
    sellerLabel: "বিক্রেতা",
    packSizeLabel: "প্যাক সাইজ",
    minimumOrderLabel: "সর্বনিম্ন অর্ডার",
    availabilityLabel: "অ্যাভেইলেবিলিটি",
    allLabel: "সব",
  },
};

export function getBuyerDiscoveryCopy(locale: Locale) {
  return BUYER_DISCOVERY_COPY[locale] ?? BUYER_DISCOVERY_COPY.en;
}

export function getBuyerDiscoveryProduct(productId: string) {
  return BUYER_DISCOVERY_PRODUCTS.find(
    (product) => product.productId === productId,
  );
}
