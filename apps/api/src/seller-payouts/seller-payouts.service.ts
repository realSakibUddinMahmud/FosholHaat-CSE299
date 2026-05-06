import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  SellerPayoutDetail,
  SellerPayoutDetailResponse,
  SellerPayoutListResponse,
  SellerPayoutStatus,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentSeller } from '../auth/current-user';

@Injectable()
export class SellerPayoutsService {
  constructor(private readonly prisma: PrismaService) {}

  private payoutStatus(paymentStatus: string): SellerPayoutStatus {
    if (paymentStatus === 'PAID') return 'settled';
    if (paymentStatus === 'AUTHORIZED') return 'processing';
    return 'pending';
  }

  private async getPayouts(
    authorization: string | undefined,
  ): Promise<SellerPayoutDetail[]> {
    const seller = await resolveCurrentSeller(this.prisma, authorization);
    const user = await this.prisma.user.findUnique({
      where: { id: seller.id },
      include: { business: true },
    });
    const lines = await this.prisma.orderLine.findMany({
      where: { supplyLot: { sellerId: seller.id } },
      include: {
        order: { include: { paymentRecord: true } },
        supplyLot: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return lines.map((line) => {
      const amount = line.quantity * line.unitPrice;
      const paymentStatus =
        line.order.paymentRecord?.status ?? line.order.paymentStatus;
      const createdAt =
        line.order.paymentRecord?.createdAt ?? line.order.createdAt;
      const referenceCode = `TR-${line.order.code}-${line.id.slice(-5)}`;
      return {
        id: line.id,
        referenceCode,
        orderRef: line.order.code,
        method: line.order.paymentRecord?.provider ?? 'manual',
        status: this.payoutStatus(paymentStatus),
        amount,
        createdAt: createdAt.toISOString(),
        periodLabel: createdAt.toLocaleDateString('en-BD', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        businessName: user?.business?.name ?? seller.fullName,
        payoutAccountLabel:
          line.order.paymentRecord?.reference ?? 'Not configured',
        breakdown: [{ label: line.supplyLot.commodityLabel, amount }],
        documents: [],
      };
    });
  }

  async getSellerPayouts(
    authorization: string | undefined,
  ): Promise<SellerPayoutListResponse> {
    const sellerPayouts = await this.getPayouts(authorization);
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
        nextDisbursementDate: pendingAmount
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          : '',
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
      featuredDetailId: sellerPayouts[0]?.id ?? '',
    };
  }

  async getSellerPayout(
    authorization: string | undefined,
    payoutId: string,
  ): Promise<SellerPayoutDetailResponse> {
    const sellerPayouts = await this.getPayouts(authorization);
    const payout = sellerPayouts.find(
      (item) => item.id === payoutId || item.referenceCode === payoutId,
    );

    if (!payout) {
      throw new NotFoundException({
        message: 'Payout not found',
        payoutId,
      });
    }

    return { payout };
  }
}
