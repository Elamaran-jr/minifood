import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    let total = 0;
    
    // Verify food items and calculate total
    for (const item of createOrderDto.items) {
      const foodItem = await this.prisma.foodItem.findUnique({
        where: { id: item.foodId },
      });

      if (!foodItem) {
        throw new NotFoundException(`Food item with ID ${item.foodId} not found`);
      }
      if (!foodItem.available) {
        throw new BadRequestException(`Food item ${foodItem.name} is currently unavailable`);
      }
      
      total += foodItem.price * item.quantity;
    }

    // Dummy payment system simulation
    const paymentSuccessful = true; // Simulating successful payment
    const finalStatus = paymentSuccessful ? 'PAID' : 'PENDING';

    // Create the order and related order items in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: finalStatus,
          orderItems: {
            create: createOrderDto.items.map(item => ({
              foodId: item.foodId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          orderItems: {
            include: { food: true }
          }
        }
      });
      
      // Clear the cart securely within the transaction
      await prisma.cartItem.deleteMany({
        where: { userId }
      });

      return order;
    });
  }

  async findMyOrders(userId: string, page: number = 1, limit: number = 10) {
    const where = { userId };
    const totalItems = await this.prisma.order.count({ where });
    
    const items = await this.prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: { food: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }
    };
  }

  async findAll(page: number = 1, limit: number = 10) {
    const totalItems = await this.prisma.order.count();
    
    const items = await this.prisma.order.findMany({
      include: {
        orderItems: {
          include: { food: true }
        },
        user: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }
    };
  }

  async getRevenue(period: 'day' | 'month' | 'year') {
    const now = new Date();
    let startDate: Date;

    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const orders = await this.prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: { gte: startDate },
      },
      include: {
        orderItems: { include: { food: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    return { period, startDate, totalRevenue, totalOrders, orders };
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }
    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Order is already cancelled');
    }
    if (order.status === 'PAID') {
      throw new BadRequestException('Cannot cancel a paid order. Please contact support.');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
