import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { AuthModule } from './auth/auth.module';
import { BuyerDiscoveryModule } from './buyer-discovery/buyer-discovery.module';
import { SellerPayoutsModule } from './seller-payouts/seller-payouts.module';
import { BuyerCartCheckoutModule } from './buyer-cart-checkout/buyer-cart-checkout.module';
import { HubDispatchOperationsModule } from './hub-dispatch-operations/hub-dispatch-operations.module';
import { HubExceptionManagementModule } from './hub-exception-management/hub-exception-management.module';
import { HubInboundOperationsModule } from './hub-inbound-operations/hub-inbound-operations.module';
import { HubSortingOperationsModule } from './hub-sorting-operations/hub-sorting-operations.module';
import { BuyerGroupBuyModule } from './buyer-group-buy/buyer-group-buy.module';
import { BuyerOrdersModule } from './buyer-orders/buyer-orders.module';
import { HubCoordinationModule } from './hub-coordination/hub-coordination.module';
import { SellerOrdersModule } from './seller-orders/seller-orders.module';
import { SellerSupplyOperationsModule } from './seller-supply-operations/seller-supply-operations.module';
import { PrismaModule } from './prisma/prisma.module';

const envFilePath = [
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(process.cwd(), '.env'),
].filter((candidate) => fs.existsSync(candidate));

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath, ignoreEnvFile: envFilePath.length === 0 }),
    PrismaModule,
    AuthModule,
    BuyerDiscoveryModule,
    SellerPayoutsModule,
    BuyerCartCheckoutModule,
    HubDispatchOperationsModule,
    HubExceptionManagementModule,
    HubInboundOperationsModule,
    HubSortingOperationsModule,
    BuyerGroupBuyModule,
    BuyerOrdersModule,
    HubCoordinationModule,
    SellerOrdersModule,
    SellerSupplyOperationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
