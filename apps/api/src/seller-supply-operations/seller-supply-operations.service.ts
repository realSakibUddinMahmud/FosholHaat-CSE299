/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateSellerSupplyInput,
  SellerDwrDetailResponse,
  SellerSupplyListResponse,
  SellerSupplyMutationResponse,
  UpdateSellerSupplyInput,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SellerSupplyOperationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSeller() {
    const user = await this.prisma.user.findFirst({
      where: { role: 'SELLER' },
    });
    if (!user) throw new BadRequestException('No seller found.');
    return user;
  }

  async getSellerSupply(): Promise<SellerSupplyListResponse> {
    const seller = await this.getSeller();
    const lots = await this.prisma.supplyLot.findMany({
      where: { sellerId: seller.id },
      include: { product: true, inboundReceipts: true },
    });

    return {
      workspace: {
        sellerName: seller.fullName,
        marketLabel: 'Bogura -> Dhaka corridor',
        metrics: [
          {
            key: 'active',
            label: 'Active lots',
            value: lots.filter((l) => l.status === 'ACTIVE').length,
          },
        ],
        primaryActionRoute: '/seller/supply/new',
      },
      listings: lots.map((lot) => ({
        id: lot.id,
        commodity: lot.product.slug as any,
        commodityLabel: lot.product.name,
        quantity: lot.quantity,
        unit: lot.unit as any,
        gradeLabel: lot.gradeLabel,
        packageLabel: lot.packageLabel,
        askingPrice: lot.askingPrice,
        availableFrom: lot.availableFrom
          ? lot.availableFrom.toISOString()
          : undefined,
        status: lot.status === 'ACTIVE' ? 'active' : 'scheduled',
        stockHint: lot.stockHint,
        dwrRecordId: lot.inboundReceipts[0]?.id,
      })),
    };
  }

  async createSellerSupply(
    input: CreateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    const seller = await this.getSeller();
    const product = await this.prisma.product.findUnique({
      where: { slug: input.commodity },
    });
    if (!product) throw new BadRequestException('Product not found');

    const lot = await this.prisma.supplyLot.create({
      data: {
        code: `LOT-${Date.now()}`,
        sellerId: seller.id,
        productId: product.id,
        commodityLabel: product.name,
        gradeLabel: input.gradeLabel,
        packageLabel: 'Standard',
        quantity: input.quantity,
        availableQty: input.quantity,
        unit: input.unit,
        askingPrice: input.askingPrice,
        status: 'ACTIVE',
        stockHint: 'New lot',
        availableFrom: input.availableFrom
          ? new Date(input.availableFrom)
          : new Date(),
      },
      include: { product: true },
    });

    return {
      listing: {
        id: lot.id,
        commodity: lot.product.slug as any,
        commodityLabel: lot.product.name,
        quantity: lot.quantity,
        unit: lot.unit as any,
        gradeLabel: lot.gradeLabel,
        packageLabel: lot.packageLabel,
        askingPrice: lot.askingPrice,
        availableFrom: lot.availableFrom?.toISOString(),
        status: 'active',
        stockHint: lot.stockHint,
        dwrRecordId: undefined as any,
      },
      message: 'Supply created successfully',
    };
  }

  async updateSellerSupply(
    listingId: string,
    input: UpdateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    const data: any = {};
    if (input.quantity) {
      data.quantity = input.quantity;
      data.availableQty = input.quantity;
    }
    if (input.askingPrice) data.askingPrice = input.askingPrice;
    if (input.gradeLabel) data.gradeLabel = input.gradeLabel;
    if (input.status)
      data.status = input.status === 'active' ? 'ACTIVE' : 'SCHEDULED';
    if (input.availableFrom) data.availableFrom = new Date(input.availableFrom);

    const lot = await this.prisma.supplyLot.update({
      where: { id: listingId },
      data,
      include: { product: true },
    });

    return {
      listing: {
        id: lot.id,
        commodity: lot.product.slug as any,
        commodityLabel: lot.product.name,
        quantity: lot.quantity,
        unit: lot.unit as any,
        gradeLabel: lot.gradeLabel,
        packageLabel: lot.packageLabel,
        askingPrice: lot.askingPrice,
        availableFrom: lot.availableFrom?.toISOString(),
        status: 'active',
        stockHint: lot.stockHint,
        dwrRecordId: undefined as any,
      },
      message: 'Supply updated',
    };
  }

  async getSellerDwrRecord(recordId: string): Promise<SellerDwrDetailResponse> {
    const receipt = await this.prisma.inboundReceipt.findUnique({
      where: { id: recordId },
      include: {
        supplyLot: { include: { product: true } },
        hub: true,
        receiver: true,
      },
    });

    if (!receipt) throw new NotFoundException('DWR not found');

    return {
      record: {
        id: receipt.id,
        listingId: receipt.supplyLotId,
        recordCode: receipt.code,
        commodityLabel: receipt.supplyLot.product.name,
        gradeLabel: receipt.supplyLot.gradeLabel,
        packageLabel: receipt.supplyLot.packageLabel,
        quantity: receipt.expectedQty,
        unit: receipt.supplyLot.unit as any,
        askingPrice: receipt.supplyLot.askingPrice,
        receivedAt: receipt.createdAt.toISOString(),
        hubLabel: receipt.hub.name,
        inspectorLabel: receipt.receiver?.fullName || 'Pending',
        notes: [receipt.notes],
      },
    };
  }
}
