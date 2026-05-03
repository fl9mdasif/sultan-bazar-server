"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_product_1 = require("./controller.product");
const validation_product_1 = require("./validation.product");
const router = express_1.default.Router();
// POST /api/products  — admin / superAdmin
router.post('/', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_product_1.productValidations.createProductValidationSchema), controller_product_1.productControllers.createProduct);
// GET /api/products  — public (supports ?search, ?category, ?status, ?isFeatured, ?minPrice, ?maxPrice, ?sort, ?page, ?limit)
router.get('/', controller_product_1.productControllers.getAllProducts);
// GET /api/products/:productId  — public (accepts ObjectId or slug)
router.get('/:productId', controller_product_1.productControllers.getSingleProduct);
// PATCH /api/products/:productId  — admin / superAdmin
router.patch('/:productId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_product_1.productValidations.updateProductValidationSchema), controller_product_1.productControllers.updateProduct);
// PATCH /api/products/:productId/toggle-featured  — admin / superAdmin
router.patch('/:productId/toggle-featured', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_product_1.productControllers.toggleFeatured);
// PATCH /api/products/:productId/variants/:variantId  — admin / superAdmin
router.patch('/:productId/variants/:variantId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_product_1.productValidations.updateVariantValidationSchema), controller_product_1.productControllers.updateVariant);
// DELETE /api/products/:productId  — admin / superAdmin
router.delete('/:productId', (0, auth_1.default)(const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_product_1.productControllers.deleteProduct);
// POST /api/products/:productId/review — user
router.post('/:productId/review', (0, auth_1.default)(const_auth_1.USER_ROLE.user), controller_product_1.productControllers.addReviewRating);
exports.productRoutes = router;
