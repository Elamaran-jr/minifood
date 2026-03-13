import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(user: any, createOrderDto: CreateOrderDto): Promise<{
        orderItems: ({
            food: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                category: string;
                available: boolean;
            };
        } & {
            id: string;
            foodId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: number;
        userId: string;
    }>;
    findMyOrders(user: any): Promise<({
        orderItems: ({
            food: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                category: string;
                available: boolean;
            };
        } & {
            id: string;
            foodId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: number;
        userId: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
        };
        orderItems: ({
            food: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                category: string;
                available: boolean;
            };
        } & {
            id: string;
            foodId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: number;
        userId: string;
    })[]>;
    cancelOrder(id: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        total: number;
        userId: string;
    }>;
}
