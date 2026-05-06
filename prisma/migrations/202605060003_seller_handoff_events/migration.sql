ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_HUB_HANDOFF';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'HUB_RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'SORTING';
ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'READY_FOR_BUYER_HANDOFF';

DO $$ BEGIN
  CREATE TYPE "SellerHandoffStatus" AS ENUM (
    'CREATED',
    'LABEL_PRINTED',
    'READY_FOR_HUB',
    'RECEIVED',
    'DISCREPANCY'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "SellerHandoff" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "hubId" TEXT,
  "handoffCode" TEXT NOT NULL,
  "qrPayload" TEXT NOT NULL,
  "sealCode" TEXT NOT NULL,
  "status" "SellerHandoffStatus" NOT NULL DEFAULT 'CREATED',
  "labelPrintedAt" TIMESTAMP(3),
  "sellerReadyAt" TIMESTAMP(3),
  "hubReceivedAt" TIMESTAMP(3),
  "discrepancyNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SellerHandoff_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OrderEvent" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "actorRole" "UserRole" NOT NULL,
  "eventType" TEXT NOT NULL,
  "fromStatus" "OrderStatus",
  "toStatus" "OrderStatus",
  "message" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SellerHandoff_orderId_key" ON "SellerHandoff"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "SellerHandoff_handoffCode_key" ON "SellerHandoff"("handoffCode");
CREATE INDEX IF NOT EXISTS "OrderEvent_orderId_createdAt_idx" ON "OrderEvent"("orderId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "SellerHandoff"
    ADD CONSTRAINT "SellerHandoff_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "SellerHandoff"
    ADD CONSTRAINT "SellerHandoff_hubId_fkey"
    FOREIGN KEY ("hubId") REFERENCES "Hub"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "OrderEvent"
    ADD CONSTRAINT "OrderEvent_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
