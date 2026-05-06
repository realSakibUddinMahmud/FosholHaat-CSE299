export type BuyerOrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING_SELLER_REVIEW'
  | 'PENDING_GROUP_LOCK'
  | 'CONFIRMED'
  | 'IN_FULFILLMENT'
  | 'READY_FOR_HUB_HANDOFF'
  | 'HUB_RECEIVED'
  | 'SORTING'
  | 'READY_FOR_DISPATCH'
  | 'READY_FOR_BUYER_HANDOFF'
  | 'COMPLETED'
  | 'CANCELLED';

export type BuyerOrderType = 'SINGLE' | 'GROUP';
export type BuyerPaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface BuyerOrderSummary {
  id: string;
  status: BuyerOrderStatus;
  title: string;
  total: string;
  estDelivery: string;
  imageUrl: string;
  dateGroup: string;
  orderType: BuyerOrderType;
  paymentStatus: BuyerPaymentStatus;
}

export interface BuyerOrderDetail extends BuyerOrderSummary {
  items: Array<{
    name: string;
    quantity: string;
    price: string;
    imageUrl?: string;
    sellerName?: string;
    packageLabel?: string;
    mode?: BuyerOrderType;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  subtotal: string;
  deliveryFee: string;
  workflow: TrackingStep[];
}

export interface TrackingStep {
  key: string;
  label: string;
  occurredAt?: string;
  status: 'done' | 'current' | 'upcoming';
  description?: string;
}

export interface BuyerOrderTrackingResponse {
  orderId: string;
  timeline: TrackingStep[];
  snapshot?: {
    title: string;
    sku?: string;
    total: string;
    deliveryAddress: string;
    contactName: string;
    contactPhone: string;
  };
  logistics?: {
    originHub: string;
    destinationHub: string;
    truckId?: string;
    fleetPartner?: string;
    lastPing?: string;
    speed?: string;
  };
}
