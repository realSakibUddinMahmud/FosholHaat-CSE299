import { Controller, Get, Headers, Param } from '@nestjs/common';
import type {
  SellerPayoutDetailResponse,
  SellerPayoutListResponse,
} from '@fosholhaat/types';
import { SellerPayoutsService } from './seller-payouts.service';

@Controller('seller/payouts')
export class SellerPayoutsController {
  constructor(private readonly sellerPayoutsService: SellerPayoutsService) {}

  @Get()
  async getSellerPayouts(
    @Headers('authorization') authorization?: string,
  ): Promise<SellerPayoutListResponse> {
    return this.sellerPayoutsService.getSellerPayouts(authorization);
  }

  @Get(':payoutId')
  async getSellerPayout(
    @Headers('authorization') authorization: string | undefined,
    @Param('payoutId') payoutId: string,
  ): Promise<SellerPayoutDetailResponse> {
    return this.sellerPayoutsService.getSellerPayout(authorization, payoutId);
  }
}
