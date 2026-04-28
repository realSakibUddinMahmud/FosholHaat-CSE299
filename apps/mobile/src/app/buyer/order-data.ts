import type { BuyerOrderDetail, BuyerOrderTrackingResponse, Locale } from '@fosholhaat/types';

export const getOrderCopy = (locale: Locale) => {
  return locale === 'bn'
    ? {
        listTitle: 'আমার অর্ডার',
        listSubtitle: 'আপনার সব অর্ডারের তথ্য এখানে দেখুন',
        ongoing: 'চলমান',
        completed: 'সম্পন্ন',
        all: 'সব',
        total: 'মোট',
        estDelivery: 'সম্ভাব্য ডেলিভারি',
        track: 'ট্র্যাকিং',
        viewDetails: 'বিস্তারিত দেখুন',
        statusSummary: 'অর্ডারের অবস্থা',
        estimated: 'সম্ভাব্য তারিখ',
        orderItems: 'অর্ডারের পণ্যসমূহ',
        quantity: 'পরিমাণ',
        pricingBreakdown: 'মূল্যের বিবরণ',
        subtotal: 'উপ-মোট',
        deliveryFee: 'ডেলিভারি চার্জ',
        bulkSavings: 'বাল্ক সাশ্রয়',
        totalAmount: 'মোট টাকা',
        fulfillment: 'ডেলিভারি সেন্টার',
        payment: 'পেমেন্ট পদ্ধতি',
        status: 'অবস্থা',
        verified: 'যাচাইকৃত',
        needHelp: 'সাহায্য প্রয়োজন?',
        processing: 'প্রসেসিং হচ্ছে',
        inTransit: 'পথে আছে',
        shipped: 'পাঠানো হয়েছে',
        delivered: 'ডেলিভারি হয়েছে',
        orderConfirmed: 'অর্ডার নিশ্চিত করা হয়েছে',
        packedAtHub: 'হাবে প্যাকিং হয়েছে',
        currentlyActive: 'বর্তমানে সক্রিয়',
        lastPing: 'শেষ অবস্থান',
      }
    : {
        listTitle: 'My Orders',
        listSubtitle: 'View and track all your orders',
        ongoing: 'Ongoing',
        completed: 'Completed',
        all: 'All',
        total: 'Total',
        estDelivery: 'Est. Delivery',
        track: 'Track',
        viewDetails: 'View Details',
        statusSummary: 'Order Status',
        estimated: 'Estimated',
        orderItems: 'Order Items',
        quantity: 'Quantity',
        pricingBreakdown: 'Pricing Breakdown',
        subtotal: 'Subtotal',
        deliveryFee: 'Delivery Fee',
        bulkSavings: 'Bulk Savings',
        totalAmount: 'Total Amount',
        fulfillment: 'Fulfillment Center',
        payment: 'Payment Info',
        status: 'Status',
        verified: 'Verified',
        needHelp: 'Need Help?',
        processing: 'Processing',
        inTransit: 'In Transit',
        shipped: 'Shipped',
        delivered: 'Delivered',
        orderConfirmed: 'Order Confirmed',
        packedAtHub: 'Packed at Hub',
        currentlyActive: 'Currently Active',
        lastPing: 'Last Location',
      };
};

export const MOCK_ORDERS: BuyerOrderDetail[] = [
  {
    id: 'FH-8492',
    status: 'IN_TRANSIT',
    title: '60 Bags: Red Onions, Premium Rice',
    total: '৳45,200',
    estDelivery: 'Oct 26',
    imageUrl: 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=200',
    dateGroup: 'TODAY, 24 OCT',
    items: [
      { name: 'Red Onions', quantity: '40 Bags', price: '৳28,000' },
      { name: 'Premium Rice', quantity: '20 Bags', price: '৳17,200' },
    ],
    shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
    paymentMethod: 'Cash on Delivery',
    subtotal: '৳45,000',
    deliveryFee: '৳200',
  },
  {
    id: 'FH-8510',
    status: 'PROCESSING',
    title: '120 Sacks: Green Lentils (Grade A)',
    total: '৳1,12,000',
    estDelivery: 'Oct 28',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200',
    dateGroup: 'TODAY, 24 OCT',
    items: [
      { name: 'Green Lentils (Grade A)', quantity: '120 Sacks', price: '৳1,11,500' },
    ],
    shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
    paymentMethod: 'Bank Transfer',
    subtotal: '৳1,11,500',
    deliveryFee: '৳500',
  },
  {
    id: 'FH-8388',
    status: 'SHIPPED',
    title: '45 Crates: Fresh Ginger, Garlic',
    total: '৳32,800',
    estDelivery: 'Oct 25',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200',
    dateGroup: 'YESTERDAY, 23 OCT',
    items: [
      { name: 'Fresh Ginger', quantity: '25 Crates', price: '৳18,000' },
      { name: 'Garlic', quantity: '20 Crates', price: '৳14,500' },
    ],
    shippingAddress: 'Plot 12, Sector 3, Uttara, Dhaka',
    paymentMethod: 'Cash on Delivery',
    subtotal: '৳32,500',
    deliveryFee: '৳300',
  },
];

export const getOrderById = (orderId?: string) => {
  if (!orderId) {
    return null;
  }

  return MOCK_ORDERS.find((order) => order.id === orderId) ?? null;
};

export const getOrderTracking = (orderId?: string): BuyerOrderTrackingResponse | null => {
  const order = getOrderById(orderId);

  if (!order) {
    return null;
  }

  return {
    orderId: order.id,
    timeline: [
      { key: 'confirmed', label: 'Order confirmed', occurredAt: 'Oct 24, 09:00 AM', status: 'done' },
      { key: 'packed', label: 'Packed at hub', occurredAt: 'Oct 24, 02:30 PM', status: 'done' },
      { key: 'in-transit', label: 'In transit', occurredAt: 'Currently active', status: 'current' },
      { key: 'delivered', label: 'Delivered', status: 'upcoming' },
    ],
  };
};
