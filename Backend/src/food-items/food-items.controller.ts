import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { FoodItemsService } from './food-items.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { GetFoodItemsFilterDto } from './dto/get-food-items-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('food-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FoodItemsController {
  constructor(private readonly foodItemsService: FoodItemsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createFoodItemDto: CreateFoodItemDto) {
    return this.foodItemsService.create(createFoodItemDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN) // both can view
  findAll(@Query() filterDto: GetFoodItemsFilterDto) {
    return this.foodItemsService.findAll(filterDto);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.foodItemsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateFoodItemDto: UpdateFoodItemDto) {
    return this.foodItemsService.update(id, updateFoodItemDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.foodItemsService.remove(id);
  }
}
