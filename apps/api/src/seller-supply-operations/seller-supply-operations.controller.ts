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
  getSellerSupply(): SellerSupplyListResponse {
    return this.sellerSupplyOperationsService.getSellerSupply();
  }

  @Post('seller/supply')
  createSellerSupply(
    @Body() body: CreateSellerSupplyInput,
  ): SellerSupplyMutationResponse {
    return this.sellerSupplyOperationsService.createSellerSupply(body);
  }

  @Patch('seller/supply/:listingId')
  updateSellerSupply(
    @Param('listingId') listingId: string,
    @Body() body: UpdateSellerSupplyInput,
  ): SellerSupplyMutationResponse {
    return this.sellerSupplyOperationsService.updateSellerSupply(
      listingId,
      body,
    );
  }

  @Get('seller/dwr/:recordId')
  getSellerDwrRecord(
    @Param('recordId') recordId: string,
  ): SellerDwrDetailResponse {
    return this.sellerSupplyOperationsService.getSellerDwrRecord(recordId);
  }
}
