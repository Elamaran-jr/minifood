import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER) // Only users have carts
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.userId);
  }

  @Post()
  addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(user.userId, dto);
  }

  @Patch(':foodId')
  updateQuantity(
    @CurrentUser() user: any,
    @Param('foodId') foodId: string,
    @Body() dto: UpdateCartDto
  ) {
    return this.cartService.updateQuantity(user.userId, foodId, dto);
  }

  @Delete(':foodId')
  removeFromCart(@CurrentUser() user: any, @Param('foodId') foodId: string) {
    return this.cartService.removeFromCart(user.userId, foodId);
  }

  @Delete()
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.userId);
  }
}
