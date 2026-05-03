"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartValidations = void 0;
const zod_1 = require("zod");
const addToCartValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string({
            message: 'Product ID is required',
        }),
        variantId: zod_1.z.string({
            message: 'Variant ID is required',
        }),
        quantity: zod_1.z.number({
            message: 'Quantity is required',
        }).min(1, 'Quantity must be at least 1'),
    }),
});
const updateCartItemValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        quantity: zod_1.z.number({
            message: 'Quantity is required',
        }).min(1, 'Quantity must be at least 1'),
    }),
});
exports.cartValidations = {
    addToCartValidationSchema,
    updateCartItemValidationSchema,
};
