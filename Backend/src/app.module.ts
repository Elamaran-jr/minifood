import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FoodItemsModule } from './food-items/food-items.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { CategoriesModule } from './categories/categories.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, FoodItemsModule, OrdersModule, CartModule, CategoriesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
