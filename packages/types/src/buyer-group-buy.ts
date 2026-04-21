import { Locale } from './auth';

export type GroupBuyStatus = 'ACTIVE' | 'GOAL_REACHED' | 'EXPIRED' | 'COMPLETED';

export interface GroupBuySummary {
  id: string;
  productId: string;
  productName: { [key in Locale]: string };
  productImage: string;
  unitPrice: number;
  groupPrice: number;
  targetQuantity: number;
  currentQuantity: number;
  deadline: string;
  status: GroupBuyStatus;
  participantCount: number;
  unit: { [key in Locale]: string };
}

export interface GroupBuyDetail extends GroupBuySummary {
  description: { [key in Locale]: string };
  sellerName: string;
  minimumJoinQuantity: number;
  sellerRating?: number;
  timeLeft?: string;
  sellerId?: string;
  maximumJoinQuantity?: number;
}

export interface JoinGroupBuyDto {
  quantity: number;
}

export interface JoinGroupBuyResponse {
  success: boolean;
  message?: string;
  orderId?: string;
}

export type GroupBuyJoinRequest = JoinGroupBuyDto;
export type GroupBuyJoinResponse = JoinGroupBuyResponse;
