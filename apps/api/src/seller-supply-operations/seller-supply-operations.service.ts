import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateSellerSupplyInput,
  SellerDwrDetailResponse,
  SellerDwrRecord,
  SellerSupplyCommodity,
  SellerSupplyListResponse,
  SellerSupplyListing,
  SellerSupplyMutationResponse,
  SellerSupplyUnit,
  UpdateSellerSupplyInput,
} from '@fosholhaat/types';
import {
  SELLER_SUPPLY_COMMODITIES,
  SELLER_SUPPLY_UNITS,
} from '@fosholhaat/types';

const COMMODITY_LABELS: Record<SellerSupplyCommodity, string> = {
  potato: 'Potato',
  onion: 'Onion',
  vegetables: 'Vegetables',
};

const PACKAGE_LABELS: Record<SellerSupplyUnit, string> = {
  kg: 'Loose kg lot',
  bag: 'Jute bag lot',
  crate: 'Plastic crate lot',
};

const supplyListings: SellerSupplyListing[] = [
  {
    id: 'supply-301',
    commodity: 'potato',
    commodityLabel: 'Potato',
    quantity: 120,
    unit: 'bag',
    gradeLabel: 'Cold store grade A',
    packageLabel: 'Jute bag lot',
    askingPrice: 1480,
    availableFrom: '2026-04-22',
    status: 'active',
    stockHint: 'Ready for pickup from Bogura this morning.',
    dwrRecordId: 'dwr-301',
  },
  {
    id: 'supply-302',
    commodity: 'onion',
    commodityLabel: 'Onion',
    quantity: 38,
    unit: 'crate',
    gradeLabel: 'Dry medium',
    packageLabel: 'Plastic crate lot',
    askingPrice: 620,
    availableFrom: '2026-04-23',
    status: 'low-stock',
    stockHint: 'Low remaining stock after two confirmed holds.',
    dwrRecordId: 'dwr-302',
  },
  {
    id: 'supply-303',
    commodity: 'vegetables',
    commodityLabel: 'Vegetables',
    quantity: 240,
    unit: 'kg',
    gradeLabel: 'Mixed fresh lot',
    packageLabel: 'Loose kg lot',
    askingPrice: 55,
    availableFrom: '2026-04-24',
    status: 'scheduled',
    stockHint: 'Scheduled for tomorrow dispatch window.',
    dwrRecordId: 'dwr-303',
  },
];

const dwrRecords: SellerDwrRecord[] = [
  {
    id: 'dwr-301',
    listingId: 'supply-301',
    recordCode: 'DWR-BOG-301',
    commodityLabel: 'Potato',
    gradeLabel: 'Cold store grade A',
    packageLabel: 'Jute bag lot',
    quantity: 120,
    unit: 'bag',
    askingPrice: 1480,
    receivedAt: '2026-04-21 06:40',
    hubLabel: 'Bogura consolidation hub',
    inspectorLabel: 'Rafi warehouse team',
    notes: [
      'Bag count matched seller declaration.',
      'Moisture check passed for active shipment.',
    ],
  },
  {
    id: 'dwr-302',
    listingId: 'supply-302',
    recordCode: 'DWR-BOG-302',
    commodityLabel: 'Onion',
    gradeLabel: 'Dry medium',
    packageLabel: 'Plastic crate lot',
    quantity: 38,
    unit: 'crate',
    askingPrice: 620,
    receivedAt: '2026-04-21 08:10',
    hubLabel: 'Bogura consolidation hub',
    inspectorLabel: 'Mita hub desk',
    notes: [
      'Two crates moved to exception shelf for count review.',
      'Seller confirmed replacement stock tomorrow.',
    ],
  },
  {
    id: 'dwr-303',
    listingId: 'supply-303',
    recordCode: 'DWR-BOG-303',
    commodityLabel: 'Vegetables',
    gradeLabel: 'Mixed fresh lot',
    packageLabel: 'Loose kg lot',
    quantity: 240,
    unit: 'kg',
    askingPrice: 55,
    receivedAt: '2026-04-21 10:00',
    hubLabel: 'Bogura consolidation hub',
    inspectorLabel: 'Sumi intake desk',
    notes: [
      'Freshness check scheduled before release.',
      'Dispatch slot assigned for early morning truck.',
    ],
  },
];

function assertPositiveNumber(
  value: number | undefined,
  message: string,
  optional = false,
) {
  if (value === undefined && optional) {
    return;
  }

  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    throw new BadRequestException({ message });
  }
}

function isCommodity(value: unknown): value is SellerSupplyCommodity {
  return (
    typeof value === 'string' &&
    SELLER_SUPPLY_COMMODITIES.includes(value as SellerSupplyCommodity)
  );
}

function isUnit(value: unknown): value is SellerSupplyUnit {
  return (
    typeof value === 'string' &&
    SELLER_SUPPLY_UNITS.includes(value as SellerSupplyUnit)
  );
}

@Injectable()
export class SellerSupplyOperationsService {
  getSellerSupply(): SellerSupplyListResponse {
    return {
      workspace: {
        sellerName: 'GreenField Traders',
        marketLabel: 'Bogura -> Dhaka corridor',
        metrics: [
          { key: 'active', label: 'Active lots', value: 3 },
          { key: 'readyToday', label: 'Ready today', value: 2 },
          { key: 'dwrOpen', label: 'DWR open', value: 3 },
        ],
        primaryActionRoute: '/seller/supply/new',
      },
      listings: supplyListings,
    };
  }

  createSellerSupply(
    input: CreateSellerSupplyInput,
  ): SellerSupplyMutationResponse {
    this.validateCreateInput(input);

    const nextCode = 304 + supplyListings.length;
    const nextId = `supply-${nextCode}`;
    const nextDwrId = `dwr-${nextCode}`;
    const listing: SellerSupplyListing = {
      id: nextId,
      commodity: input.commodity,
      commodityLabel: COMMODITY_LABELS[input.commodity],
      quantity: input.quantity,
      unit: input.unit,
      gradeLabel: input.gradeLabel.trim(),
      packageLabel: PACKAGE_LABELS[input.unit],
      askingPrice: input.askingPrice,
      availableFrom: input.availableFrom,
      status: 'scheduled',
      stockHint: 'Saved and waiting for the next dispatch slot.',
      dwrRecordId: nextDwrId,
    };

    supplyListings.unshift(listing);
    dwrRecords.unshift({
      id: nextDwrId,
      listingId: nextId,
      recordCode: `DWR-BOG-${nextCode}`,
      commodityLabel: listing.commodityLabel,
      gradeLabel: listing.gradeLabel,
      packageLabel: listing.packageLabel,
      quantity: listing.quantity,
      unit: listing.unit,
      askingPrice: listing.askingPrice,
      receivedAt: '2026-04-21 12:10',
      hubLabel: 'Bogura consolidation hub',
      inspectorLabel: 'Pending assignment',
      notes: ['Initial seller entry saved before inspection.'],
    });

    return {
      listing,
      message: 'Supply saved',
    };
  }

  updateSellerSupply(
    listingId: string,
    input: UpdateSellerSupplyInput,
  ): SellerSupplyMutationResponse {
    const listing = supplyListings.find((item) => item.id === listingId);

    if (!listing) {
      throw new NotFoundException({ message: 'Supply not found', listingId });
    }

    if (input.quantity !== undefined) {
      assertPositiveNumber(input.quantity, 'Quantity must be positive');
      listing.quantity = input.quantity;
    }

    if (input.askingPrice !== undefined) {
      assertPositiveNumber(input.askingPrice, 'Price must be positive');
      listing.askingPrice = input.askingPrice;
    }

    if (input.gradeLabel !== undefined) {
      if (!input.gradeLabel.trim()) {
        throw new BadRequestException({ message: 'Grade label is required' });
      }
      listing.gradeLabel = input.gradeLabel.trim();
    }

    if (input.availableFrom !== undefined) {
      listing.availableFrom = input.availableFrom;
    }

    if (input.status !== undefined) {
      listing.status = input.status;
    }

    const dwr = dwrRecords.find((item) => item.id === listing.dwrRecordId);
    if (dwr) {
      dwr.quantity = listing.quantity;
      dwr.gradeLabel = listing.gradeLabel;
      dwr.askingPrice = listing.askingPrice;
    }

    return {
      listing,
      message: 'Supply updated',
    };
  }

  getSellerDwrRecord(recordId: string): SellerDwrDetailResponse {
    const record = dwrRecords.find((item) => item.id === recordId);

    if (!record) {
      throw new NotFoundException({
        message: 'DWR record not found',
        recordId,
      });
    }

    return { record };
  }

  private validateCreateInput(input: CreateSellerSupplyInput) {
    if (!isCommodity(input.commodity)) {
      throw new BadRequestException({
        message: 'Commodity must stay in MVP list',
      });
    }

    if (!isUnit(input.unit)) {
      throw new BadRequestException({ message: 'Unit is invalid' });
    }

    assertPositiveNumber(input.quantity, 'Quantity must be positive');
    assertPositiveNumber(input.askingPrice, 'Price must be positive');

    if (!input.gradeLabel.trim()) {
      throw new BadRequestException({ message: 'Grade label is required' });
    }
  }
}
