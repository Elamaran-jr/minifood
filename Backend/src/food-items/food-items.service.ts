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
    const { categoryIds, ...rest } = createFoodItemDto;
    return this.prisma.foodItem.create({
      data: {
        ...rest,
        categories: { connect: categoryIds.map(id => ({ id })) }
      },
    });
  }

  async findAll(filterDto: GetFoodItemsFilterDto) {
    const { search, category, categoryId, minPrice, maxPrice, page = 1, limit = 10 } = filterDto;
    
    const where: Prisma.FoodItemWhereInput = {
      isDeleted: false
    };

    if (search) {
      where.name = {
        contains: search,
      };
    }

    if (category) {
      where.categories = { some: { name: category } };
    }

    if (categoryId) {
      where.categories = { some: { id: categoryId } };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    const totalItems = await this.prisma.foodItem.count({ where });
    const items = await this.prisma.foodItem.findMany({
      where,
      include: { categories: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: string) {
    const foodItem = await this.prisma.foodItem.findUnique({
      where: { id, isDeleted: false },
      include: { categories: true },
    });
    if (!foodItem) {
      throw new NotFoundException(`Food item with ID ${id} not found`);
    }
    return foodItem;
  }

  async update(id: string, updateFoodItemDto: UpdateFoodItemDto) {
    await this.findOne(id); // Ensure exists
    const { categoryIds, ...rest } = updateFoodItemDto;
    return this.prisma.foodItem.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryIds && { 
          categories: { 
            set: categoryIds.map(id => ({ id })) 
          } 
        })
      },
    });
  }

  async remove(id: string) {
    const item = await this.findOne(id); // Ensure exists and not deleted

    return this.prisma.$transaction(async (prisma) => {
      // 1. Clear active carts containing this item
      await prisma.cartItem.deleteMany({
        where: { foodId: id },
      });

      // 2. Mark as deleted and unavailable
      return prisma.foodItem.update({
        where: { id },
        data: { 
          isDeleted: true,
          available: false
        },
      });
    });
  }
}
