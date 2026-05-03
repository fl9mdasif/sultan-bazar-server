"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_cart_1 = require("./controller.cart");
const validation_cart_1 = require("./validation.cart");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_cart_1.cartValidations.addToCartValidationSchema), controller_cart_1.cartControllers.addToCart);
router.get('/', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_cart_1.cartControllers.getCart);
router.patch('/:productId/:variantId', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_cart_1.cartValidations.updateCartItemValidationSchema), controller_cart_1.cartControllers.updateCartItemQuantity);
router.delete('/:productId/:variantId', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_cart_1.cartControllers.removeFromCart);
router.delete('/', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_cart_1.cartControllers.clearCart);
exports.cartRoutes = router;
