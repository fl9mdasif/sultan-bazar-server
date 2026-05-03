"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderValidations = void 0;
const zod_1 = require("zod");
// ── Shared sub-schemas ─────────────────────────────────────────────────────────
const shippingAddressSchema = zod_1.z.object({
    fullName: zod_1.z.string({ message: 'Full name is required' }).trim().min(1),
    phone: zod_1.z.string({ message: 'Phone is required' }).trim().min(1),
    address: zod_1.z.string({ message: 'Address is required' }).trim().min(1),
    city: zod_1.z.string({ message: 'City is required' }).trim().min(1),
    district: zod_1.z.string({ message: 'District is required' }).trim().min(1),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional().default('Bangladesh'),
});
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string({ message: 'Product ID is required' }),
    variantId: zod_1.z.string({ message: 'Variant ID is required' }),
    quantity: zod_1.z.number({ message: 'Quantity is required' }).int().min(1),
});
// ── Place Order ────────────────────────────────────────────────────────────────
const placeOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        items: zod_1.z
            .array(orderItemSchema)
            .min(1, { message: 'At least one item is required' }),
        shippingAddress: shippingAddressSchema,
        paymentMethod: zod_1.z.enum(['cod', 'bkash', 'nagad', 'card', 'bank'], {
            message: 'Invalid payment method',
        }),
        discount: zod_1.z.number().min(0).optional().default(0),
        note: zod_1.z.string().optional(),
    }),
});
// ── Update Order Status (admin) ────────────────────────────────────────────────
const updateOrderStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'], { message: 'Invalid order status' }),
        note: zod_1.z.string().optional(),
    }),
});
// ── Update Payment Status (admin) ──────────────────────────────────────────────
const updatePaymentStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentStatus: zod_1.z.enum(['pending', 'paid', 'failed', 'refunded'], {
            message: 'Invalid payment status',
        }),
        transactionId: zod_1.z.string().optional(),
    }),
});
exports.orderValidations = {
    placeOrderValidationSchema,
    updateOrderStatusValidationSchema,
    updatePaymentStatusValidationSchema,
};
