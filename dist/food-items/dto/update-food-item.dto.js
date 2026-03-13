"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFoodItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_food_item_dto_1 = require("./create-food-item.dto");
class UpdateFoodItemDto extends (0, mapped_types_1.PartialType)(create_food_item_dto_1.CreateFoodItemDto) {
}
exports.UpdateFoodItemDto = UpdateFoodItemDto;
//# sourceMappingURL=update-food-item.dto.js.map