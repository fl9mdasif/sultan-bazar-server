"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const addressBaseSchema = zod_1.z.object({
    label: zod_1.z.string().optional(),
    fullName: zod_1.z.string({ message: 'Full name is required' }).min(1),
    phone: zod_1.z.string({ message: 'Phone is required' }).min(1),
    address: zod_1.z.string({ message: 'Address is required' }).min(1),
    city: zod_1.z.string({ message: 'City is required' }).min(1),
    district: zod_1.z.string({ message: 'District is required' }).min(1),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    isDefault: zod_1.z.boolean().optional(),
});
// POST /users/addresses
const addAddressValidation = zod_1.z.object({
    body: addressBaseSchema,
});
// PATCH /users/addresses/:id
const updateAddressValidation = zod_1.z.object({
    body: addressBaseSchema.partial(), // every field optional on update
});
exports.userValidations = {
    addAddressValidation,
    updateAddressValidation,
};
