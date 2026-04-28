/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/require-await, @typescript-eslint/no-unused-vars */
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

const SERVICE_FEE = 35;
const HUB_PICKUP_FEE = 0;
const DIRECT_DELIVERY_FEE = 120;

@Injectable()
export class BuyerCartCheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  private async getBuyer() {
    const user = await this.prisma.user.findFirst({ where: { role: 'BUYER' } });
    if (!user)
      throw new BadRequestException('No buyer found. Please run seed script.');
    return user;
  }

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: {
        lines: {
          include: {
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

  async getBuyerCart(): Promise<BuyerCartResponse> {
    const buyer = await this.getBuyer();
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
      })),
      totals,
      nextRoute: '/buyer/checkout',
    };
  }

  async updateBuyerCartLine(
    lineId: string,
    request: BuyerCartMutationPayload = {},
  ): Promise<BuyerCartResponse> {
    const buyer = await this.getBuyer();
    const cart = await this.getOrCreateCart(buyer.id);

    const line = cart.lines.find((item: any) => item.id === lineId);
    if (!line) {
      throw new BadRequestException(
        this.createError('INVALID_QUANTITY', 'Cart line not found.', lineId),
      );
    }

    if (request.quantity !== undefined) {
      this.assertQuantity(lineId, request.quantity);
      await this.prisma.cartLine.update({
        where: { id: lineId },
        data: { quantity: request.quantity },
      });
    }

    return this.getBuyerCart();
  }

  async setCheckoutFulfillment(
    request: BuyerFulfillmentDetails,
  ): Promise<BuyerFulfillmentResponse> {
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
    request: BuyerPaymentDetails,
  ): Promise<BuyerPaymentResponse> {
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

  async submitCheckout(): Promise<BuyerCheckoutSubmitResponse> {
    const buyer = await this.getBuyer();
    const cart = await this.getOrCreateCart(buyer.id);

    if (cart.lines.length === 0) {
      throw new BadRequestException(
        this.createError('EMPTY_CART', 'Cart is empty.'),
      );
    }

    const totals = this.calculateTotals(cart.lines as any);

    const orderId = `ORD-${Date.now()}`;

    await this.prisma.order.create({
      data: {
        code: orderId,
        buyerId: buyer.id,
        status: 'PENDING_PAYMENT',
        subtotal: totals.subtotal,
        total: totals.payableTotal,
        lines: {
          create: cart.lines.map((l: any) => ({
            supplyLotId: l.supplyLotId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            sellerName:
              l.supplyLot.business?.name || l.supplyLot.seller.fullName,
          })),
        },
      },
    });

    await this.prisma.cart.update({
      where: { id: cart.id },
      data: { status: 'CHECKED_OUT' },
    });

    return {
      orderId,
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
