import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BuyerGroupBuyService } from './buyer-group-buy.service';
import {
  GroupBuySummary,
  GroupBuyDetail,
  JoinGroupBuyDto,
  JoinGroupBuyResponse,
} from '@fosholhaat/types';

@Controller('buyer/group-buys')
export class BuyerGroupBuyController {
  constructor(private readonly service: BuyerGroupBuyService) {}

  @Get()
  getGroupBuys(): GroupBuySummary[] {
    return this.service.getGroupBuys();
  }

  @Get(':groupBuyId')
  getGroupBuyDetail(@Param('groupBuyId') groupBuyId: string): GroupBuyDetail {
    const detail = this.service.getGroupBuyDetail(groupBuyId);
    if (!detail) {
      throw new NotFoundException(`Group buy with ID ${groupBuyId} not found`);
    }
    return detail;
  }

  @Post(':groupBuyId/join')
  @HttpCode(HttpStatus.OK)
  joinGroupBuy(
    @Param('groupBuyId') groupBuyId: string,
    @Body() request: JoinGroupBuyDto,
  ): JoinGroupBuyResponse {
    return this.service.joinGroupBuy(groupBuyId, request);
  }
}
