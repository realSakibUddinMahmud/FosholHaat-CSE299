/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import type {
  BuyerCartLine,
  BuyerCartMutationPayload,
  BuyerCartResponse,
  BuyerCheckoutErrorResponse,
  BuyerCheckoutSubmitResponse,
  BuyerFulfillmentDetails,
  BuyerFulfillmentResponse,
  BuyerPaymentDetails,
  BuyerPaymentResponse,
} from '@fosholhaat/types';
import {
  BUYER_FULFILLMENT_CHOICES,
  BUYER_PAYMENT_METHODS,
} from '@fosholhaat/types';
import { PrismaService } from '../prisma/prisma.service';
import { resolveCurrentBuyer } from '../auth/current-user';

const SERVICE_FEE = 35;
const HUB_PICKUP_FEE = 0;
const DIRECT_DELIVERY_FEE = 120;

@Injectable()
export class BuyerCartCheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        lines: {
          include: {
            groupBuy: true,
            supplyLot: {
              include: { product: true, seller: true, business: true },
            },
          },
        },
      },
    });
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId, status: 'ACTIVE' },
        include: {
          lines: {
            include: {
              groupBuy: true,
              supplyLot: {
                include: { product: true, seller: true, business: true },
              },
            },
          },
        },
      });
    }
    return cart;
  }

  async getBuyerCart(authorization?: string): Promise<BuyerCartResponse> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const cart = await this.getOrCreateCart(buyer.id);
    const totals = this.calculateTotals(cart.lines as any);

    return {
      lines: cart.lines.map((line: any) => ({
        lineId: line.id,
        productId: line.supplyLot.product.id,
        productName: line.supplyLot.product.name,
        sellerName:
          line.supplyLot.business?.name || line.supplyLot.seller.fullName,
        quantity: line.quantity,
        unit: line.supplyLot.unit,
        unitPrice: line.unitPrice,
        subtotal: line.quantity * line.unitPrice,
        mode: line.mode,
        groupBuyId: line.groupBuy?.code,
        note:
          line.mode === 'GROUP'
            ? 'Group-buy order stays pending until the target is filled.'
            : undefined,
      })),
      totals,
      nextRoute: '/buyer/checkout',
    };
  }

  async updateBuyerCartLine(
    authorization: string | undefined,
    lineId: string,
    request: BuyerCartMutationPayload = {},
  ): Promise<BuyerCartResponse> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const cart = await this.getOrCreateCart(buyer.id);

    const line = cart.lines.find((item: any) => item.id === lineId);
    if (!line) {
      throw new BadRequestException(
        this.createError('INVALID_QUANTITY', 'Cart line not found.', lineId),
      );
    }

    if (request.quantity !== undefined) {
      this.assertQuantity(lineId, request.quantity);
      if ((line as any).mode === 'GROUP') {
        const groupBuy = (line as any).groupBuy;
        if (
          !groupBuy ||
          groupBuy.status !== 'LIVE' ||
          request.quantity + groupBuy.committedQty > groupBuy.targetQty
        ) {
          throw new BadRequestException(
            this.createError(
              'INVALID_QUANTITY',
              'Quantity exceeds the remaining group-buy target.',
              lineId,
            ),
          );
        }
      }
      await this.prisma.cartLine.update({
        where: { id: lineId },
        data: { quantity: request.quantity },
      });
    }

    return this.getBuyerCart(authorization);
  }

  async addBuyerCartLine(
    authorization: string | undefined,
    supplyLotId: string,
    request: BuyerCartMutationPayload = {},
  ): Promise<BuyerCartResponse> {
    const quantity = request.quantity ?? 1;
    this.assertQuantity(supplyLotId, quantity);
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const cart = await this.getOrCreateCart(buyer.id);
    const mode =
      request.mode === 'GROUP' || request.groupBuyId ? 'GROUP' : 'SINGLE';
    const groupBuy =
      mode === 'GROUP'
        ? await this.prisma.groupBuy.findFirst({
            where: {
              code: request.groupBuyId,
              supplyLotId,
              status: 'LIVE',
            },
          })
        : null;
    const lot = await this.prisma.supplyLot.findUnique({
      where: { id: supplyLotId },
    });
    if (
      !lot ||
      lot.availableQty < quantity ||
      (mode === 'SINGLE' && !lot.singleBuyEnabled) ||
      (mode === 'GROUP' && (!groupBuy || !lot.groupBuyEnabled))
    ) {
      throw new BadRequestException(
        this.createError(
          'INVALID_QUANTITY',
          'Supply lot is unavailable.',
          supplyLotId,
        ),
      );
    }
    if (mode === 'SINGLE') {
      const min = lot.singleMinQty || 1;
      const max = lot.singleMaxQty || lot.availableQty;
      if (quantity < min || quantity > max) {
        throw new BadRequestException(
          this.createError(
            'INVALID_QUANTITY',
            `Single buy quantity must be between ${min} and ${max}.`,
            supplyLotId,
          ),
        );
      }
    }
    const existing = cart.lines.find(
      (item: any) =>
        item.supplyLotId === supplyLotId &&
        item.mode === mode &&
        (mode === 'SINGLE' || item.groupBuyId === groupBuy?.id),
    );
    if (existing) {
      await this.prisma.cartLine.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
          unitPrice: mode === 'GROUP' ? groupBuy!.groupPrice : lot.askingPrice,
        },
      });
    } else {
      await this.prisma.cartLine.create({
        data: {
          cartId: cart.id,
          supplyLotId,
          quantity,
          unitPrice: mode === 'GROUP' ? groupBuy!.groupPrice : lot.askingPrice,
          mode,
          groupBuyId: groupBuy?.id,
        },
      });
    }
    return this.getBuyerCart(authorization);
  }

  async setCheckoutFulfillment(
    authorization: string | undefined,
    request: BuyerFulfillmentDetails,
  ): Promise<BuyerFulfillmentResponse> {
    await resolveCurrentBuyer(this.prisma, authorization);
    this.assertFulfillmentDetails(request);

    return {
      fulfillment: {
        choice: request.choice,
        recipientName: request.recipientName.trim(),
        phone: request.phone.trim(),
        addressLabel: request.addressLabel?.trim() || undefined,
        note: request.note?.trim() || undefined,
      },
      nextRoute: '/buyer/checkout/payment',
    };
  }

  async setCheckoutPayment(
    authorization: string | undefined,
    request: BuyerPaymentDetails,
  ): Promise<BuyerPaymentResponse> {
    await resolveCurrentBuyer(this.prisma, authorization);
    this.assertPaymentDetails(request);

    return {
      payment: {
        method: request.method,
        payableTotal: request.payableTotal,
        referenceLabel: request.referenceLabel?.trim() || undefined,
      },
      nextRoute: '/buyer/checkout/confirmation',
    };
  }

  async submitCheckout(
    authorization?: string,
  ): Promise<BuyerCheckoutSubmitResponse> {
    const buyer = await resolveCurrentBuyer(this.prisma, authorization);
    const cart = await this.getOrCreateCart(buyer.id);

    if (cart.lines.length === 0) {
      throw new BadRequestException(
        this.createError('EMPTY_CART', 'Cart is empty.'),
      );
    }

    const totals = this.calculateTotals(cart.lines as any);

    const orderIds: string[] = [];
    await this.prisma.$transaction(async (tx) => {
      const groups = new Map<string, any[]>();
      for (const line of cart.lines as any[]) {
        const key = line.mode === 'GROUP' ? 'GROUP' : 'SINGLE';
        groups.set(key, [...(groups.get(key) ?? []), line]);
      }
      let index = 0;
      for (const [mode, lines] of groups) {
        index += 1;
        const subtotal = lines.reduce(
          (sum, line) => sum + line.quantity * line.unitPrice,
          0,
        );
        const code = `ORD-${Date.now()}-${index}`;
        const isGroup = mode === 'GROUP';
        await tx.order.create({
          data: {
            code,
            buyerId: buyer.id,
            status: isGroup ? 'PENDING_GROUP_LOCK' : 'PENDING_SELLER_REVIEW',
            orderType: isGroup ? 'GROUP' : 'SINGLE',
            subtotal,
            total: subtotal + (subtotal > 0 ? SERVICE_FEE : 0),
            paymentStatus: isGroup ? 'AUTHORIZED' : 'PENDING',
            lines: {
              create: lines.map((l: any) => ({
                supplyLotId: l.supplyLotId,
                quantity: l.quantity,
                unitPrice: l.unitPrice,
                mode: isGroup ? 'GROUP' : 'SINGLE',
                groupBuyId: l.groupBuyId,
                sellerName:
                  l.supplyLot.business?.name || l.supplyLot.seller.fullName,
              })),
            },
            paymentRecord: {
              create: {
                status: isGroup ? 'AUTHORIZED' : 'PENDING',
                provider: 'manual',
                reference: isGroup ? 'GROUP-BUY-AUTHORIZED' : undefined,
                amount: subtotal + (subtotal > 0 ? SERVICE_FEE : 0),
              },
            },
          },
        });
        orderIds.push(code);
        if (isGroup) {
          for (const line of lines) {
            if (!line.groupBuyId) continue;
            await tx.groupBuyCommitment.upsert({
              where: {
                groupBuyId_buyerId: {
                  groupBuyId: line.groupBuyId,
                  buyerId: buyer.id,
                },
              },
              create: {
                groupBuyId: line.groupBuyId,
                buyerId: buyer.id,
                quantity: line.quantity,
              },
              update: { quantity: { increment: line.quantity } },
            });
            const updated = await tx.groupBuy.update({
              where: { id: line.groupBuyId },
              data: { committedQty: { increment: line.quantity } },
            });
            if (updated.committedQty >= updated.targetQty) {
              await tx.groupBuy.update({
                where: { id: updated.id },
                data: { status: 'LOCKED' },
              });
              await tx.order.updateMany({
                where: {
                  orderType: 'GROUP',
                  status: 'PENDING_GROUP_LOCK',
                  lines: { some: { groupBuyId: updated.id } },
                },
                data: { status: 'PENDING_SELLER_REVIEW' },
              });
            }
          }
        }
      }
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { status: 'CHECKED_OUT' },
    });

    return {
      orderId: orderIds[0] ?? `ORD-${Date.now()}`,
      successRoute: '/buyer/orders/success',
    };
  }

  private assertQuantity(
    lineId: string,
    quantity: BuyerCartMutationPayload['quantity'],
  ): asserts quantity is number {
    const isValidQuantity =
      typeof quantity === 'number' &&
      Number.isInteger(quantity) &&
      quantity > 0;

    if (isValidQuantity) return;

    throw new BadRequestException(
      this.createError(
        'INVALID_QUANTITY',
        'Quantity must be a positive integer.',
        lineId,
      ),
    );
  }

  private assertFulfillmentDetails(request: BuyerFulfillmentDetails): void {
    const choiceValid = BUYER_FULFILLMENT_CHOICES.includes(request?.choice);
    const recipientName = request?.recipientName?.trim();
    const phone = request?.phone?.trim();
    const addressLabel = request?.addressLabel?.trim();
    const addressRequired = request?.choice === 'direct-delivery';

    if (
      !choiceValid ||
      !recipientName ||
      !this.isValidPhone(phone) ||
      (addressRequired && !addressLabel)
    ) {
      throw new BadRequestException(
        this.createError(
          'MISSING_FULFILLMENT_DETAILS',
          'Fulfillment details are required.',
        ),
      );
    }
  }

  private assertPaymentDetails(request: BuyerPaymentDetails): void {
    const methodValid = BUYER_PAYMENT_METHODS.includes(request?.method);
    const referenceRequired = request?.method !== 'cash-on-delivery';
    const referenceLabel = request?.referenceLabel?.trim();

    if (!methodValid || (referenceRequired && !referenceLabel)) {
      throw new BadRequestException(
        this.createError(
          'PAYMENT_VALIDATION_FAILED',
          'Payment details are invalid.',
        ),
      );
    }
  }

  private calculateTotals(cartLines: any[]): BuyerCartResponse['totals'] {
    const subtotal = cartLines.reduce(
      (total, line) => total + line.quantity * line.unitPrice,
      0,
    );
    const deliveryFee = HUB_PICKUP_FEE;
    const serviceFee = subtotal > 0 ? SERVICE_FEE : 0;

    return {
      subtotal,
      deliveryFee,
      serviceFee,
      payableTotal: subtotal + deliveryFee + serviceFee,
    };
  }

  private isValidPhone(phone: string | undefined): boolean {
    return !!phone && /^[0-9+\- ]{7,}$/.test(phone);
  }

  private createError(
    code: BuyerCheckoutErrorResponse['error']['code'],
    message: string,
    lineId?: string,
  ): BuyerCheckoutErrorResponse {
    return {
      error: lineId ? { code, message, lineId } : { code, message },
    };
  }
}
