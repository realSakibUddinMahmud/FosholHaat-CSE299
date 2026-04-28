import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type {
  CreateSellerSupplyInput,
  SellerDwrDetailResponse,
  SellerSupplyListResponse,
  SellerSupplyMutationResponse,
  UpdateSellerSupplyInput,
} from '@fosholhaat/types';
import { SellerSupplyOperationsService } from './seller-supply-operations.service';

@Controller()
export class SellerSupplyOperationsController {
  constructor(
    private readonly sellerSupplyOperationsService: SellerSupplyOperationsService,
  ) {}

  @Get('seller/supply')
  async getSellerSupply(): Promise<SellerSupplyListResponse> {
    return this.sellerSupplyOperationsService.getSellerSupply();
  }

  @Post('seller/supply')
  async createSellerSupply(
    @Body() body: CreateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    return this.sellerSupplyOperationsService.createSellerSupply(body);
  }

  @Patch('seller/supply/:listingId')
  async updateSellerSupply(
    @Param('listingId') listingId: string,
    @Body() body: UpdateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    return this.sellerSupplyOperationsService.updateSellerSupply(
      listingId,
      body,
    );
  }

  @Get('seller/dwr/:recordId')
  async getSellerDwrRecord(
    @Param('recordId') recordId: string,
  ): Promise<SellerDwrDetailResponse> {
    return this.sellerSupplyOperationsService.getSellerDwrRecord(recordId);
  }
}
