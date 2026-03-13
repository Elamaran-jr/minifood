"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createOrderDto) {
        let total = 0;
        for (const item of createOrderDto.items) {
            const foodItem = await this.prisma.foodItem.findUnique({
                where: { id: item.foodId },
            });
            if (!foodItem) {
                throw new common_1.NotFoundException(`Food item with ID ${item.foodId} not found`);
            }
            if (!foodItem.available) {
                throw new common_1.BadRequestException(`Food item ${foodItem.name} is currently unavailable`);
            }
            total += foodItem.price * item.quantity;
        }
        const paymentSuccessful = true;
        const finalStatus = paymentSuccessful ? 'PAID' : 'PENDING';
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
            return order;
        });
    }
    async findMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: { food: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: {
                orderItems: {
                    include: { food: true }
                },
                user: { select: { id: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async cancelOrder(id, userId) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        if (order.userId !== userId) {
            throw new common_1.ForbiddenException('You can only cancel your own orders');
        }
        if (order.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Order is already cancelled');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map