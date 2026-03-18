import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('revenue')
  @Roles(Role.ADMIN)
  getRevenue(@Query('period') period: string = 'month') {
    const validPeriod = ['day', 'month', 'year'].includes(period) ? period as 'day' | 'month' | 'year' : 'month';
    return this.ordersService.getRevenue(validPeriod);
  }

  @Post()
  @Roles(Role.USER) // Typically only users place orders
  create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user.userId, createOrderDto);
  }

  @Get('my-orders')
  @Roles(Role.USER, Role.ADMIN)
  findMyOrders(
    @CurrentUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.ordersService.findMyOrders(user.userId, parseInt(page), parseInt(limit));
  }

  @Get()
  @Roles(Role.ADMIN) // Admin can view all orders
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    return this.ordersService.findAll(parseInt(page), parseInt(limit));
  }

  @Delete(':id')
  @Roles(Role.USER) // User cancels their own order
  cancelOrder(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.cancelOrder(id, user.userId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN) // Admin updates status
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
