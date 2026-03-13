import { PrismaService } from '../prisma/prisma.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { GetFoodItemsFilterDto } from './dto/get-food-items-filter.dto';
export declare class FoodItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFoodItemDto: CreateFoodItemDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        category: string;
        available: boolean;
    }>;
    findAll(filterDto: GetFoodItemsFilterDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        category: string;
        available: boolean;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        category: string;
        available: boolean;
    }>;
    update(id: string, updateFoodItemDto: UpdateFoodItemDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        category: string;
        available: boolean;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        category: string;
        available: boolean;
    }>;
}
