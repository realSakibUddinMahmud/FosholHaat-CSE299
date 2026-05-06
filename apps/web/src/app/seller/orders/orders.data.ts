import type {
  Locale,
  SellerOrderDetailResponse,
  SellerOrderQueueResponse,
  SellerOrderStatus,
  SellerOrderSummary,
} from "@fosholhaat/types";
import { getSellerOrdersCopy } from "@fosholhaat/types";

/**
 * Empty queue for test-mode fallback only.
 * In production and dev, data comes from the API.
 */
export const SELLER_ORDER_QUEUE: SellerOrderQueueResponse = {
  summary: { incoming: 0, active: 0, ready: 0, groupProgress: 0 },
  orders: [],
  groupProgress: [],
};

export function getSellerOrdersCopyWeb(locale: Locale) {
  return getSellerOrdersCopy(locale);
}

export function getSellerOrderStatusLabel(
  locale: Locale,
  status: SellerOrderStatus,
) {
  return getSellerOrdersCopy(locale).statuses[status];
}

/**
 * @deprecated — order detail now comes from the API.
 */
export function getSellerOrderDetail(
  _orderId: string,
): SellerOrderDetailResponse | null {
  return null;
}
