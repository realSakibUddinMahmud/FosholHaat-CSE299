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
  getSellerPayouts(): SellerPayoutListResponse {
    return this.sellerPayoutsService.getSellerPayouts();
  }

  @Get(':payoutId')
  getSellerPayout(
    @Param('payoutId') payoutId: string,
  ): SellerPayoutDetailResponse {
    return this.sellerPayoutsService.getSellerPayout(payoutId);
  }
}
