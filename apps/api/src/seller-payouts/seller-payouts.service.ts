import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  SellerPayoutDetail,
  SellerPayoutDetailResponse,
  SellerPayoutListResponse,
} from '@fosholhaat/types';

const sellerPayouts: SellerPayoutDetail[] = [
  {
    id: 'payout-2026-10-28',
    referenceCode: '#TR-10492',
    orderRef: '#FH-8492',
    method: 'Bank transfer',
    status: 'settled',
    amount: 12450,
    createdAt: '2026-10-28',
    periodLabel: '28 Oct 2026',
    businessName: 'GreenLeaf Wholesalers Ltd.',
    payoutAccountLabel: 'Chase **** 8291',
    breakdown: [
      { label: 'Orders settled', amount: 12980 },
      { label: 'Service fee', amount: -530 },
    ],
    documents: [
      { id: 'csv-oct', title: 'CSV statement (Oct)', format: 'csv' },
      { id: 'pdf-q3', title: 'PDF tax invoice (Q3)', format: 'pdf' },
    ],
  },
  {
    id: 'payout-2026-10-27',
    referenceCode: '#TR-10488',
    orderRef: '#FH-8485',
    method: 'bKash',
    status: 'processing',
    amount: 8920,
    createdAt: '2026-10-27',
    periodLabel: '27 Oct 2026',
    businessName: 'GreenLeaf Wholesalers Ltd.',
    payoutAccountLabel: 'bKash merchant balance',
    breakdown: [
      { label: 'Orders settled', amount: 9260 },
      { label: 'Service fee', amount: -340 },
    ],
    documents: [],
  },
  {
    id: 'payout-2026-10-26',
    referenceCode: '#TR-10482',
    orderRef: '#FH-8472',
    method: 'Bank transfer',
    status: 'settled',
    amount: 23830,
    createdAt: '2026-10-26',
    periodLabel: '26 Oct 2026',
    businessName: 'GreenLeaf Wholesalers Ltd.',
    payoutAccountLabel: 'Chase **** 8291',
    breakdown: [
      { label: 'Orders settled', amount: 24620 },
      { label: 'Service fee', amount: -790 },
    ],
    documents: [
      { id: 'csv-oct-26', title: 'CSV statement (26 Oct)', format: 'csv' },
    ],
  },
];

@Injectable()
export class SellerPayoutsService {
  getSellerPayouts(): SellerPayoutListResponse {
    const pendingAmount = sellerPayouts
      .filter((payout) => payout.status !== 'settled')
      .reduce((total, payout) => total + payout.amount, 0);
    const completedAmount = sellerPayouts
      .filter((payout) => payout.status === 'settled')
      .reduce((total, payout) => total + payout.amount, 0);

    return {
      summary: {
        pending: pendingAmount,
        completed: completedAmount,
        total: pendingAmount + completedAmount,
        nextDisbursementAmount: pendingAmount,
        nextDisbursementDate: '2026-11-05',
      },
      records: sellerPayouts.map((payout) => ({
        id: payout.id,
        referenceCode: payout.referenceCode,
        orderRef: payout.orderRef,
        method: payout.method,
        status: payout.status,
        amount: payout.amount,
        createdAt: payout.createdAt,
        periodLabel: payout.periodLabel,
      })),
      featuredDetailId: sellerPayouts[0].id,
    };
  }

  getSellerPayout(payoutId: string): SellerPayoutDetailResponse {
    const payout = sellerPayouts.find((item) => item.id === payoutId);

    if (!payout) {
      throw new NotFoundException({
        message: 'Payout not found',
        payoutId,
      });
    }

    return { payout };
  }
}
