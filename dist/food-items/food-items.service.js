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
exports.FoodItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoodItemsService = class FoodItemsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFoodItemDto) {
        return this.prisma.foodItem.create({
            data: createFoodItemDto,
        });
    }
    async findAll(filterDto) {
        const { search, category, minPrice, maxPrice } = filterDto;
        const where = {};
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
            if (minPrice)
                where.price.gte = minPrice;
            if (maxPrice)
                where.price.lte = maxPrice;
        }
        return this.prisma.foodItem.findMany({
            where,
        });
    }
    async findOne(id) {
        const foodItem = await this.prisma.foodItem.findUnique({
            where: { id },
        });
        if (!foodItem) {
            throw new common_1.NotFoundException(`Food item with ID ${id} not found`);
        }
        return foodItem;
    }
    async update(id, updateFoodItemDto) {
        await this.findOne(id);
        return this.prisma.foodItem.update({
            where: { id },
            data: updateFoodItemDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.foodItem.delete({
            where: { id },
        });
    }
};
exports.FoodItemsService = FoodItemsService;
exports.FoodItemsService = FoodItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodItemsService);
//# sourceMappingURL=food-items.service.js.map