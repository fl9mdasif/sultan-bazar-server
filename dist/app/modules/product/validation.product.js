"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidations = void 0;
const zod_1 = require("zod");
// ── Variant ─────────────────────────────────────────────────────────────────
const variantSchema = zod_1.z.object({
    name: zod_1.z.string({ message: 'Variant name is required' }).trim().min(1),
    sku: zod_1.z.string({ message: 'SKU is required' }).trim().min(1),
    price: zod_1.z.number({ message: 'Price is required' }).positive(),
    discountPrice: zod_1.z.number().positive().nullable().optional(),
    stock: zod_1.z.number().int().min(0).default(0),
    weight: zod_1.z.number().positive().optional(),
    images: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
    isAvailable: zod_1.z.boolean().optional().default(true),
    attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
});
const updateVariantSchema = variantSchema.partial().extend({
// SKU must remain present so we know which variant to update (if patching individually)
});
const updateVariantValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        price: zod_1.z.number().positive().optional(),
        discountPrice: zod_1.z.number().positive().nullable().optional(),
        stock: zod_1.z.number().int().min(0).optional(),
        weight: zod_1.z.number().positive().optional(),
        images: zod_1.z.array(zod_1.z.string().url()).optional(),
        isAvailable: zod_1.z.boolean().optional(),
        attributes: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided to update',
    }),
});
// ── Product ──────────────────────────────────────────────────────────────────
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: 'Product name is required' }).trim().min(1),
        slug: zod_1.z
            .string({ message: 'Slug is required' })
            .trim()
            .min(1)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only',
        }),
        description: zod_1.z.string({ message: 'Description is required' }).min(1),
        category: zod_1.z.string({ message: 'Category ID is required' }),
        tags: zod_1.z.array(zod_1.z.string()).optional().default([]),
        thumbnail: zod_1.z
            .string({ message: 'Thumbnail URL is required' })
            .url({ message: 'Thumbnail must be a valid URL' }),
        gallery: zod_1.z.array(zod_1.z.string().url()).optional().default([]),
        variants: zod_1.z
            .array(variantSchema)
            .min(1, { message: 'At least one variant is required' }),
        status: zod_1.z.enum(['active', 'draft', 'archived']).optional().default('draft'),
        isFeatured: zod_1.z.boolean().optional().default(false),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1).optional(),
        slug: zod_1.z
            .string()
            .trim()
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'Slug must be lowercase letters, numbers, and hyphens only',
        })
            .optional(),
        description: zod_1.z.string().min(1).optional(),
        category: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        thumbnail: zod_1.z.string().url().optional(),
        gallery: zod_1.z.array(zod_1.z.string().url()).optional(),
        variants: zod_1.z.array(updateVariantSchema).min(1).optional(),
        status: zod_1.z.enum(['active', 'draft', 'archived']).optional(),
        isFeatured: zod_1.z.boolean().optional(),
        metaTitle: zod_1.z.string().optional(),
        metaDescription: zod_1.z.string().optional(),
    }),
});
exports.productValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
    updateVariantValidationSchema,
};
