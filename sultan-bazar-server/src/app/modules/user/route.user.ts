import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../auth/const.auth';
import { userControllers } from './controller.user';
import { userValidations } from './validation.user';

const router = express.Router();

// ── Address routes (user / admin / superAdmin) ────────────────────────────────

// GET all saved addresses
router.get(
    '/addresses',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.getAddresses,
);

// POST add a new address
router.post(
    '/addresses',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(userValidations.addAddressValidation),
    userControllers.addAddress,
);

// PATCH update a specific address
router.patch(
    '/addresses/:id',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    validateRequest(userValidations.updateAddressValidation),
    userControllers.updateAddress,
);

// PATCH set an address as default
router.patch(
    '/addresses/:id/default',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.setDefaultAddress,
);

// DELETE remove an address
router.delete(
    '/addresses/:id',
    auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
    userControllers.deleteAddress,
);

// ── Superadmin: User management routes ────────────────────────────────────────

// GET  /api/v1/users          — list all users (search, role, page, limit)
router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    userControllers.getAllUsers,
);

// PATCH /api/v1/users/:id/role   — change a user's role
router.patch(
    '/:id/role',
    auth(USER_ROLE.superAdmin),
    userControllers.updateUserRole,
);

// PATCH /api/v1/users/:id/block  — toggle block/unblock
router.patch(
    '/:id/block',
    auth(USER_ROLE.superAdmin),
    userControllers.toggleBlockUser,
);

// DELETE /api/v1/users/:id       — permanently delete a user
router.delete(
    '/:id',
    auth(USER_ROLE.superAdmin),
    userControllers.deleteUser,
);

export const userRoutes = router;
