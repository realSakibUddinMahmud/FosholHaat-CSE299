import { Controller, Get, Param } from '@nestjs/common';
import type {
  SellerPayoutDetailResponse,
  SellerPayoutListResponse,
} from '@fosholhaat/types';
import { SellerPayoutsService } from './seller-payouts.service';

@Controller('seller/payouts')
export class SellerPayoutsController {
  constructor(private readonly sellerPayoutsService: SellerPayoutsService) {}

  @Get()
  async getSellerPayouts(): Promise<SellerPayoutListResponse> {
    return this.sellerPayoutsService.getSellerPayouts();
  }

  @Get(':payoutId')
  async getSellerPayout(
    @Param('payoutId') payoutId: string,
  ): Promise<SellerPayoutDetailResponse> {
    return this.sellerPayoutsService.getSellerPayout(payoutId);
  }
}
