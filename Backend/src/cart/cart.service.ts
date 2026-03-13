import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { food: true },
    });
    
    return items.map(item => ({
      id: item.foodId,
      cartItemId: item.id,
      name: item.food.name,
      price: item.food.price,
      imageUrl: item.food.imageUrl,
      quantity: item.quantity,
    }));
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_foodId: {
          userId,
          foodId: dto.foodId,
        },
      },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        foodId: dto.foodId,
        quantity: dto.quantity,
      },
    });
  }

  async updateQuantity(userId: string, foodId: string, dto: UpdateCartDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_foodId: { userId, foodId },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });
  }

  async removeFromCart(userId: string, foodId: string) {
    return this.prisma.cartItem.deleteMany({
      where: {
        userId,
        foodId,
      },
    });
  }

  async clearCart(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}
