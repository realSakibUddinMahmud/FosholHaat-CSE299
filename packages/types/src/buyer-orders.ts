export type BuyerOrderStatus = 'PROCESSING' | 'IN_TRANSIT' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface BuyerOrderSummary {
  id: string;
  status: BuyerOrderStatus;
  title: string;
  total: string;
  estDelivery: string;
  imageUrl: string;
  dateGroup: string;
}

export interface BuyerOrderDetail extends BuyerOrderSummary {
  items: Array<{
    name: string;
    quantity: string;
    price: string;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  subtotal: string;
  deliveryFee: string;
}

export interface TrackingStep {
  key: string;
  label: string;
  occurredAt?: string;
  status: 'done' | 'current' | 'upcoming';
}

export interface BuyerOrderTrackingResponse {
  orderId: string;
  timeline: TrackingStep[];
}
