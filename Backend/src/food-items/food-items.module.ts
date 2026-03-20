import { Module } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { FoodItemsController } from './food-items.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [FoodItemsService],
  controllers: [FoodItemsController]
})
export class FoodItemsModule {}
