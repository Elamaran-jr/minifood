import { Module } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';

@Module({
  providers: [FoodItemsService],
  controllers: [FoodItemsController]
})
export class FoodItemsModule {}
