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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemsController = void 0;
const common_1 = require("@nestjs/common");
const food_items_service_1 = require("./food-items.service");
const create_food_item_dto_1 = require("./dto/create-food-item.dto");
const update_food_item_dto_1 = require("./dto/update-food-item.dto");
const get_food_items_filter_dto_1 = require("./dto/get-food-items-filter.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let FoodItemsController = class FoodItemsController {
    foodItemsService;
    constructor(foodItemsService) {
        this.foodItemsService = foodItemsService;
    }
    create(createFoodItemDto) {
        return this.foodItemsService.create(createFoodItemDto);
    }
    findAll(filterDto) {
        return this.foodItemsService.findAll(filterDto);
    }
    findOne(id) {
        return this.foodItemsService.findOne(id);
    }
    update(id, updateFoodItemDto) {
        return this.foodItemsService.update(id, updateFoodItemDto);
    }
    remove(id) {
        return this.foodItemsService.remove(id);
    }
};
exports.FoodItemsController = FoodItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_food_item_dto_1.CreateFoodItemDto]),
    __metadata("design:returntype", void 0)
], FoodItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.USER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_food_items_filter_dto_1.GetFoodItemsFilterDto]),
    __metadata("design:returntype", void 0)
], FoodItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.USER, client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoodItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_food_item_dto_1.UpdateFoodItemDto]),
    __metadata("design:returntype", void 0)
], FoodItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FoodItemsController.prototype, "remove", null);
exports.FoodItemsController = FoodItemsController = __decorate([
    (0, common_1.Controller)('food-items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [food_items_service_1.FoodItemsService])
], FoodItemsController);
//# sourceMappingURL=food-items.controller.js.map