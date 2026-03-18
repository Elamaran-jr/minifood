import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    let total = 0;
    
    // Verify food items and calculate total
    for (const item of createOrderDto.items) {
      const foodItem = await this.prisma.foodItem.findFirst({
        where: { id: item.foodId, isDeleted: false },
      });

      if (!foodItem) {
        throw new NotFoundException(`Food item with ID ${item.foodId} not found or has been removed`);
      }
      if (!foodItem.available) {
        throw new BadRequestException(`Food item ${foodItem.name} is currently unavailable`);
      }
      
      total += foodItem.price * item.quantity;
    }

    // Create the order and related order items in a transaction
    return this.prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status: 'PLACED',
          paymentStatus: 'PAID',
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
          },
          user: { select: { id: true, email: true, username: true } }
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
        },
        user: { select: { id: true, email: true, username: true } }
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
        user: { select: { id: true, email: true, username: true } }
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
        status: 'DELIVERED',
        createdAt: { gte: startDate },
      },
      include: {
        orderItems: { include: { food: true } },
        user: { select: { email: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;

    // Aggregate top dishes
    const itemStats: Record<string, { 
      name: string, 
      totalQuantity: number, 
      revenue: number, 
      orderOccurrences: number,
      price: number 
    }> = {};
    
    orders.forEach(order => {
      const itemsInThisOrder = new Set<string>();
      order.orderItems.forEach(oi => {
        if (!oi.food) return;
        const id = oi.foodId;
        if (!itemStats[id]) {
          itemStats[id] = { 
            name: oi.food.name, 
            totalQuantity: 0, 
            revenue: 0, 
            orderOccurrences: 0,
            price: oi.food.price
          };
        }
        itemStats[id].totalQuantity += oi.quantity;
        itemStats[id].revenue += oi.food.price * oi.quantity;
        
        if (!itemsInThisOrder.has(id)) {
          itemStats[id].orderOccurrences += 1;
          itemsInThisOrder.add(id);
        }
      });
    });

    const topDishes = Object.values(itemStats)
      .map(stat => {
        const avgQty = stat.orderOccurrences > 0 ? stat.totalQuantity / stat.orderOccurrences : 0;
        return {
          name: stat.name,
          count: stat.totalQuantity, // Total quantity sold
          orderCount: stat.orderOccurrences, // Number of orders containing this item
          avgQty: avgQty,
          avgRevenue: avgQty * stat.price
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { period, startDate, totalRevenue, totalOrders, orders, topDishes };
  }

  async cancelOrder(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }
    if (order.status !== 'PLACED') {
      throw new BadRequestException('Orders can only be cancelled while in PLACED status. Once confirmed, contact support.');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async updateStatus(id: string, newStatus: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED') {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    const currentStatus = order.status as OrderStatus;
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      PLACED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['DELIVERED'], // Admin cannot cancel once processing
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!transitions[currentStatus].includes(newStatus as OrderStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}. Forward-only or cancellation permitted.`
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}
