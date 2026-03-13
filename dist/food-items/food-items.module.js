"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemsModule = void 0;
const common_1 = require("@nestjs/common");
const food_items_service_1 = require("./food-items.service");
const food_items_controller_1 = require("./food-items.controller");
let FoodItemsModule = class FoodItemsModule {
};
exports.FoodItemsModule = FoodItemsModule;
exports.FoodItemsModule = FoodItemsModule = __decorate([
    (0, common_1.Module)({
        providers: [food_items_service_1.FoodItemsService],
        controllers: [food_items_controller_1.FoodItemsController]
    })
], FoodItemsModule);
//# sourceMappingURL=food-items.module.js.map