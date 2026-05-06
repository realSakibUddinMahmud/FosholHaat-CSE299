import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type {
  CreateSellerSupplyInput,
  SellerDwrDetailResponse,
  SellerDwrListResponse,
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
  async getSellerSupply(
    @Headers('authorization') authorization?: string,
  ): Promise<SellerSupplyListResponse> {
    return this.sellerSupplyOperationsService.getSellerSupply(authorization);
  }

  @Post('seller/supply')
  async createSellerSupply(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: CreateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    return this.sellerSupplyOperationsService.createSellerSupply(
      authorization,
      body,
    );
  }

  @Patch('seller/supply/:listingId')
  async updateSellerSupply(
    @Headers('authorization') authorization: string | undefined,
    @Param('listingId') listingId: string,
    @Body() body: UpdateSellerSupplyInput,
  ): Promise<SellerSupplyMutationResponse> {
    return this.sellerSupplyOperationsService.updateSellerSupply(
      authorization,
      listingId,
      body,
    );
  }

  @Get('seller/dwr')
  async getSellerDwrList(
    @Headers('authorization') authorization?: string,
  ): Promise<SellerDwrListResponse> {
    return this.sellerSupplyOperationsService.getSellerDwrList(authorization);
  }

  @Get('seller/dwr/:recordId')
  async getSellerDwrRecord(
    @Headers('authorization') authorization: string | undefined,
    @Param('recordId') recordId: string,
  ): Promise<SellerDwrDetailResponse> {
    return this.sellerSupplyOperationsService.getSellerDwrRecord(
      authorization,
      recordId,
    );
  }
}
