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

const buyerCartSeed: BuyerCartLine[] = [
  {
    lineId: 'CL-5101',
    productId: 'PR-1001',
    productName: 'Prime Potato',
    sellerName: 'Bogra Fresh Supply',
    quantity: 8,
    unit: 'kg',
    unitPrice: 42,
    subtotal: 336,
  },
  {
    lineId: 'CL-5102',
    productId: 'PR-1002',
    productName: 'Farm Onion',
    sellerName: 'North Agro Market',
    quantity: 5,
    unit: 'bag',
    unitPrice: 118,
    subtotal: 590,
    note: 'Pack in dry condition.',
  },
  {
    lineId: 'CL-5103',
    productId: 'PR-1003',
    productName: 'Mixed Vegetables',
    sellerName: 'Dhaka Valley Produce',
    quantity: 4,
    unit: 'crate',
    unitPrice: 180,
    subtotal: 720,
  },
];

const SERVICE_FEE = 35;
const HUB_PICKUP_FEE = 0;
const DIRECT_DELIVERY_FEE = 120;

@Injectable()
export class BuyerCartCheckoutService {
  private readonly cartLines: BuyerCartLine[] = structuredClone(buyerCartSeed);
  private fulfillment: BuyerFulfillmentDetails | null = null;
  private payment: BuyerPaymentDetails | null = null;
  private submittedOrderId: string | null = null;

  getBuyerCart(): BuyerCartResponse {
    return {
      lines: this.cartLines.map((line) => ({ ...line })),
      totals: this.calculateTotals(),
      nextRoute: '/buyer/checkout',
    };
  }

  updateBuyerCartLine(
    lineId: string,
    request: BuyerCartMutationPayload = {},
  ): BuyerCartResponse {
    this.assertCheckoutOpen();
    const line = this.findLine(lineId);
    this.assertQuantity(lineId, request.quantity);

    line.quantity = request.quantity;
    line.subtotal = line.quantity * line.unitPrice;
    this.fulfillment = null;
    this.payment = null;

    return this.getBuyerCart();
  }

  setCheckoutFulfillment(
    request: BuyerFulfillmentDetails,
  ): BuyerFulfillmentResponse {
    this.assertCheckoutOpen();
    this.assertCartNotEmpty();
    this.assertFulfillmentDetails(request);

    this.fulfillment = {
      choice: request.choice,
      recipientName: request.recipientName.trim(),
      phone: request.phone.trim(),
      addressLabel: request.addressLabel?.trim() || undefined,
      note: request.note?.trim() || undefined,
    };
    this.payment = null;

    return {
      fulfillment: this.fulfillment,
      nextRoute: '/buyer/checkout/payment',
    };
  }

  setCheckoutPayment(request: BuyerPaymentDetails): BuyerPaymentResponse {
    this.assertCheckoutOpen();
    this.assertCartNotEmpty();
    this.assertFulfillmentPresent();
    this.assertPaymentDetails(request);

    this.payment = {
      method: request.method,
      payableTotal: this.calculateTotals().payableTotal,
      referenceLabel: request.referenceLabel?.trim() || undefined,
    };

    return {
      payment: this.payment,
      nextRoute: '/buyer/checkout/confirmation',
    };
  }

  submitCheckout(): BuyerCheckoutSubmitResponse {
    if (this.submittedOrderId) {
      throw new ConflictException(
        this.createError(
          'CHECKOUT_SUBMISSION_CONFLICT',
          'Checkout has already been submitted.',
        ),
      );
    }

    this.assertCartNotEmpty();
    this.assertFulfillmentPresent();
    this.assertPaymentPresent();
    this.assertPaymentMatchesTotals();

    this.submittedOrderId = `ORD-${Date.now()}`;

    return {
      orderId: this.submittedOrderId,
      successRoute: '/buyer/orders/success',
    };
  }

  private findLine(lineId: string): BuyerCartLine {
    const line = this.cartLines.find((item) => item.lineId === lineId);
    if (!line) {
      throw new BadRequestException(
        this.createError('INVALID_QUANTITY', 'Cart line not found.', lineId),
      );
    }
    return line;
  }

  private assertQuantity(
    lineId: string,
    quantity: BuyerCartMutationPayload['quantity'],
  ): asserts quantity is number {
    const isValidQuantity =
      typeof quantity === 'number' &&
      Number.isInteger(quantity) &&
      quantity > 0;

    if (isValidQuantity) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'INVALID_QUANTITY',
        'Quantity must be a positive integer.',
        lineId,
      ),
    );
  }

  private assertCartNotEmpty(): void {
    if (this.cartLines.length > 0) {
      return;
    }

    throw new BadRequestException(
      this.createError('EMPTY_CART', 'Cart is empty.'),
    );
  }

  private assertFulfillmentPresent(): void {
    if (this.fulfillment) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'MISSING_FULFILLMENT_DETAILS',
        'Fulfillment details are required.',
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
    const totals = this.calculateTotals();
    const payableMatches = request?.payableTotal === totals.payableTotal;
    const referenceRequired = request?.method !== 'cash-on-delivery';
    const referenceLabel = request?.referenceLabel?.trim();

    if (
      !methodValid ||
      !payableMatches ||
      (referenceRequired && !referenceLabel)
    ) {
      throw new BadRequestException(
        this.createError(
          'PAYMENT_VALIDATION_FAILED',
          'Payment details are invalid.',
        ),
      );
    }
  }

  private assertPaymentPresent(): void {
    if (this.payment) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'PAYMENT_VALIDATION_FAILED',
        'Payment details are required.',
      ),
    );
  }

  private assertPaymentMatchesTotals(): void {
    if (!this.payment) {
      return;
    }

    const payableTotal = this.calculateTotals().payableTotal;
    if (this.payment.payableTotal === payableTotal) {
      return;
    }

    throw new BadRequestException(
      this.createError(
        'PAYMENT_VALIDATION_FAILED',
        'Payment total no longer matches the cart.',
      ),
    );
  }

  private assertCheckoutOpen(): void {
    if (!this.submittedOrderId) {
      return;
    }

    throw new ConflictException(
      this.createError(
        'CHECKOUT_SUBMISSION_CONFLICT',
        'Checkout has already been submitted.',
      ),
    );
  }

  private calculateTotals(): BuyerCartResponse['totals'] {
    const subtotal = this.cartLines.reduce(
      (total, line) => total + line.subtotal,
      0,
    );
    const deliveryFee = this.fulfillment
      ? this.fulfillment.choice === 'direct-delivery'
        ? DIRECT_DELIVERY_FEE
        : HUB_PICKUP_FEE
      : HUB_PICKUP_FEE;
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
