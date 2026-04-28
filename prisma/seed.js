"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new client_1.PrismaClient({
    log: ['info'],
});
async function main() {
    await prisma.groupBuyCommitment.deleteMany();
    await prisma.groupBuy.deleteMany();
    await prisma.paymentRecord.deleteMany();
    await prisma.orderLine.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartLine.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.sortingBatch.deleteMany();
    await prisma.inboundReceipt.deleteMany();
    await prisma.supplyLot.deleteMany();
    await prisma.accountSession.deleteMany();
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.hub.deleteMany();
    await prisma.business.deleteMany();
    const [buyerBusiness, sellerBusiness, hubBusiness] = await Promise.all([
        prisma.business.create({
            data: { name: "Dhaka Buyer Circle", role: client_1.UserRole.BUYER, district: "Dhaka" },
        }),
        prisma.business.create({
            data: { name: "Bogura GreenField Traders", role: client_1.UserRole.SELLER, district: "Bogura" },
        }),
        prisma.business.create({
            data: { name: "Bogura Fulfillment Hub", role: client_1.UserRole.HUB_MANAGER, district: "Bogura" },
        }),
    ]);
    const hub = await prisma.hub.create({
        data: {
            name: "Bogura Consolidation Hub",
            district: "Bogura",
        },
    });
    const [buyer, seller, hubManager] = await Promise.all([
        prisma.user.create({
            data: {
                email: "buyer@fosholhaat.local",
                passwordHash: "seed-password",
                fullName: "Dhaka Buyer User",
                role: client_1.UserRole.BUYER,
                locale: client_1.Locale.bn,
                businessId: buyerBusiness.id,
            },
        }),
        prisma.user.create({
            data: {
                email: "seller@fosholhaat.local",
                passwordHash: "seed-password",
                fullName: "Bogura Seller User",
                role: client_1.UserRole.SELLER,
                locale: client_1.Locale.bn,
                businessId: sellerBusiness.id,
            },
        }),
        prisma.user.create({
            data: {
                email: "hub@fosholhaat.local",
                passwordHash: "seed-password",
                fullName: "Hub Manager User",
                role: client_1.UserRole.HUB_MANAGER,
                locale: client_1.Locale.bn,
                businessId: hubBusiness.id,
            },
        }),
    ]);
    await prisma.accountSession.createMany({
        data: [
            {
                token: "seed-session-buyer",
                userId: buyer.id,
                activeRole: client_1.UserRole.BUYER,
                expiresAt: new Date("2027-01-01T00:00:00.000Z"),
            },
            {
                token: "seed-session-seller",
                userId: seller.id,
                activeRole: client_1.UserRole.SELLER,
                expiresAt: new Date("2027-01-01T00:00:00.000Z"),
            },
            {
                token: "seed-session-hub",
                userId: hubManager.id,
                activeRole: client_1.UserRole.HUB_MANAGER,
                expiresAt: new Date("2027-01-01T00:00:00.000Z"),
            },
        ],
    });
    const [potato, onion, vegetables] = await Promise.all([
        prisma.product.create({
            data: {
                slug: "bogura-potato-lot",
                name: "Bogura potato lot",
                category: "potato",
                unitLabel: "50 kg bag",
                imageUrl: "https://images.example.com/potato-101.jpg",
            },
        }),
        prisma.product.create({
            data: {
                slug: "dhaka-onion-line",
                name: "Dhaka onion line",
                category: "onion",
                unitLabel: "40 kg bag",
                imageUrl: "https://images.example.com/onion-102.jpg",
            },
        }),
        prisma.product.create({
            data: {
                slug: "mixed-vegetables-crate",
                name: "Mixed vegetables crate",
                category: "vegetables",
                unitLabel: "mixed crate",
                imageUrl: "https://images.example.com/vegetable-103.jpg",
            },
        }),
    ]);
    const potatoSupply = await prisma.supplyLot.create({
        data: {
            code: "supply-301",
            sellerId: seller.id,
            businessId: sellerBusiness.id,
            productId: potato.id,
            commodityLabel: "Potato",
            gradeLabel: "Cold store grade A",
            packageLabel: "Jute bag lot",
            quantity: 120,
            availableQty: 108,
            unit: "bag",
            askingPrice: 1480,
            availableFrom: new Date("2026-04-22T00:00:00.000Z"),
            status: client_1.SupplyLotStatus.ACTIVE,
            stockHint: "Ready for pickup from Bogura this morning.",
        },
    });
    const onionSupply = await prisma.supplyLot.create({
        data: {
            code: "supply-302",
            sellerId: seller.id,
            businessId: sellerBusiness.id,
            productId: onion.id,
            commodityLabel: "Onion",
            gradeLabel: "Dry medium",
            packageLabel: "Plastic crate lot",
            quantity: 38,
            availableQty: 38,
            unit: "crate",
            askingPrice: 620,
            availableFrom: new Date("2026-04-23T00:00:00.000Z"),
            status: client_1.SupplyLotStatus.SCHEDULED,
            stockHint: "Low remaining stock after two confirmed holds.",
        },
    });
    await prisma.supplyLot.create({
        data: {
            code: "supply-303",
            sellerId: seller.id,
            businessId: sellerBusiness.id,
            productId: vegetables.id,
            commodityLabel: "Vegetables",
            gradeLabel: "Mixed fresh lot",
            packageLabel: "Loose kg lot",
            quantity: 240,
            availableQty: 240,
            unit: "kg",
            askingPrice: 55,
            availableFrom: new Date("2026-04-24T00:00:00.000Z"),
            status: client_1.SupplyLotStatus.SCHEDULED,
            stockHint: "Scheduled for tomorrow dispatch window.",
        },
    });
    const receipt = await prisma.inboundReceipt.create({
        data: {
            code: "RC-7801",
            supplyLotId: potatoSupply.id,
            hubId: hub.id,
            receiverId: hubManager.id,
            expectedQty: 120,
            actualQty: 118,
            status: "RECEIVED",
            notes: "Two bags separated for quality review before sorting.",
        },
    });
    await prisma.sortingBatch.create({
        data: {
            code: "SB-9101",
            inboundReceiptId: receipt.id,
            hubId: hub.id,
            assignedToId: hubManager.id,
            laneLabel: "Sorting Bay 1",
            quantity: 118,
            status: "READY",
            notes: "Start the first sort pass.",
        },
    });
    const cart = await prisma.cart.create({
        data: {
            userId: buyer.id,
            locale: client_1.Locale.bn,
            status: "ACTIVE",
            lines: {
                create: [
                    {
                        supplyLotId: potatoSupply.id,
                        quantity: 4,
                        unitPrice: 1480,
                    },
                ],
            },
        },
    });
    const order = await prisma.order.create({
        data: {
            code: "FH-8492",
            buyerId: buyer.id,
            businessId: buyerBusiness.id,
            status: "CONFIRMED",
            subtotal: 5920,
            total: 5920,
            paymentStatus: client_1.PaymentStatus.PAID,
            lines: {
                create: [
                    {
                        supplyLotId: potatoSupply.id,
                        quantity: 4,
                        unitPrice: 1480,
                        sellerName: seller.fullName,
                    },
                ],
            },
            paymentRecord: {
                create: {
                    status: client_1.PaymentStatus.PAID,
                    provider: "manual",
                    reference: "seed-payment-fh-8492",
                    amount: 5920,
                },
            },
        },
    });
    await prisma.groupBuy.create({
        data: {
            code: "gb-1",
            productId: potato.id,
            supplyLotId: potatoSupply.id,
            targetQty: 1000,
            committedQty: 65,
            groupPrice: 38,
            status: "LIVE",
            deadlineAt: new Date("2026-04-23T18:00:00.000Z"),
            commitments: {
                create: [{ buyerId: buyer.id, quantity: 65 }],
            },
        },
    });
    await prisma.cart.update({
        where: { id: cart.id },
        data: { status: "CHECKED_OUT" },
    });
    await prisma.supplyLot.update({
        where: { id: potatoSupply.id },
        data: { availableQty: 104, status: client_1.SupplyLotStatus.ORDERED },
    });
    await prisma.supplyLot.update({
        where: { id: onionSupply.id },
        data: { status: client_1.SupplyLotStatus.SCHEDULED },
    });
    console.log("Seed complete", { buyerId: buyer.id, sellerId: seller.id, hubId: hub.id, orderId: order.id });
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
