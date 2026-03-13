import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { GetFoodItemsFilterDto } from './dto/get-food-items-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FoodItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createFoodItemDto: CreateFoodItemDto) {
    return this.prisma.foodItem.create({
      data: createFoodItemDto,
    });
  }

  async findAll(filterDto: GetFoodItemsFilterDto) {
    const { search, category, minPrice, maxPrice } = filterDto;
    
    const where: Prisma.FoodItemWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    return this.prisma.foodItem.findMany({
      where,
    });
  }

  async findOne(id: string) {
    const foodItem = await this.prisma.foodItem.findUnique({
      where: { id },
    });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return foodItem;
  }

  async update(id: string, updateFoodItemDto: UpdateFoodItemDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.foodItem.update({
      where: { id },
      data: updateFoodItemDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    return this.prisma.foodItem.delete({
      where: { id },
    });
  }
}
