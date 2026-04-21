import { Injectable } from '@nestjs/common';
import {
  GroupBuySummary,
  GroupBuyDetail,
  JoinGroupBuyDto,
  JoinGroupBuyResponse,
} from '@fosholhaat/types';

@Injectable()
export class BuyerGroupBuyService {
  private groupBuys: GroupBuyDetail[] = [
    {
      id: 'gb-1',
      productId: 'p-1',
      productName: { bn: 'বগুড়ার আলু', en: 'Bogura Potatoes' },
      productImage:
        'https://images.unsplash.com/photo-1518977676601-b53f02bad177',
      unitPrice: 45,
      groupPrice: 38,
      targetQuantity: 1000,
      currentQuantity: 650,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      status: 'ACTIVE',
      participantCount: 45,
      description: {
        bn: 'সরাসরি বগুড়া থেকে সংগৃহীত ফ্রেশ গোল আলু। গ্রুপে কিনলে পাচ্ছেন অবিশ্বাস্য ছাড়।',
        en: 'Fresh round potatoes directly sourced from Bogura. Get incredible discounts when buying in a group.',
      },
      sellerName: 'Bogura Agro Traders',
      minimumJoinQuantity: 10,
      unit: { bn: 'কেজি', en: 'kg' },
    },
    {
      id: 'gb-2',
      productId: 'p-2',
      productName: { bn: 'পেঁয়াজ (লাল)', en: 'Onion (Red)' },
      productImage:
        'https://images.unsplash.com/photo-1508747703725-719777637510',
      unitPrice: 85,
      groupPrice: 72,
      targetQuantity: 500,
      currentQuantity: 420,
      deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
      status: 'ACTIVE',
      participantCount: 32,
      description: {
        bn: 'দেশি লাল পেঁয়াজ, রান্নায় দিবে অসাধারণ স্বাদ।',
        en: 'Local red onions, providing exceptional taste to your cooking.',
      },
      sellerName: 'Pabna Vegetables',
      minimumJoinQuantity: 5,
      unit: { bn: 'কেজি', en: 'kg' },
    },
  ];

  getGroupBuys(): GroupBuySummary[] {
    return this.groupBuys.map(
      ({
        id,
        productId,
        productName,
        productImage,
        unitPrice,
        groupPrice,
        targetQuantity,
        currentQuantity,
        deadline,
        status,
        participantCount,
        unit,
      }) => ({
        id,
        productId,
        productName,
        productImage,
        unitPrice,
        groupPrice,
        targetQuantity,
        currentQuantity,
        deadline,
        status,
        participantCount,
        unit,
      }),
    );
  }

  getGroupBuyDetail(id: string): GroupBuyDetail | undefined {
    return this.groupBuys.find((gb) => gb.id === id);
  }

  joinGroupBuy(id: string, request: JoinGroupBuyDto): JoinGroupBuyResponse {
    const gb = this.groupBuys.find((g) => g.id === id);
    if (!gb) {
      return { success: false, message: 'Group buy not found' };
    }

    if (!Number.isFinite(request.quantity) || request.quantity <= 0) {
      return { success: false, message: 'Join quantity must be positive' };
    }

    if (gb.status !== 'ACTIVE') {
      return {
        success: false,
        message:
          gb.status === 'EXPIRED'
            ? 'Group buy has expired'
            : 'Group buy is no longer active',
      };
    }

    gb.currentQuantity += request.quantity;
    gb.participantCount += 1;

    return {
      success: true,
      orderId: `ord-gb-${Math.random().toString(36).slice(2, 11)}`,
      message: 'Successfully joined the group buy!',
    };
  }
}
