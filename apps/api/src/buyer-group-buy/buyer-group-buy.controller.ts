import {
  Controller,
  Get,
  Headers,
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
  async getGroupBuys(
    @Headers('authorization') authorization?: string,
  ): Promise<GroupBuySummary[]> {
    return this.service.getGroupBuys(authorization);
  }

  @Get(':groupBuyId')
  async getGroupBuyDetail(
    @Headers('authorization') authorization: string | undefined,
    @Param('groupBuyId') groupBuyId: string,
  ): Promise<GroupBuyDetail> {
    const detail = await this.service.getGroupBuyDetail(
      authorization,
      groupBuyId,
    );
    if (!detail) {
      throw new NotFoundException(`Group buy with ID ${groupBuyId} not found`);
    }
    return detail;
  }

  @Post(':groupBuyId/join')
  @HttpCode(HttpStatus.OK)
  async joinGroupBuy(
    @Headers('authorization') authorization: string | undefined,
    @Param('groupBuyId') groupBuyId: string,
    @Body() request: JoinGroupBuyDto,
  ): Promise<JoinGroupBuyResponse> {
    return this.service.joinGroupBuy(authorization, groupBuyId, request);
  }
}
