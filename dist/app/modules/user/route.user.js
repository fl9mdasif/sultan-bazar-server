"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const const_auth_1 = require("../auth/const.auth");
const controller_user_1 = require("./controller.user");
const validation_user_1 = require("./validation.user");
const router = express_1.default.Router();
// ── Address routes (user / admin / superAdmin) ────────────────────────────────
// GET all saved addresses
router.get('/addresses', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.getAddresses);
// POST add a new address
router.post('/addresses', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_user_1.userValidations.addAddressValidation), controller_user_1.userControllers.addAddress);
// PATCH update a specific address
router.patch('/addresses/:id', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(validation_user_1.userValidations.updateAddressValidation), controller_user_1.userControllers.updateAddress);
// PATCH set an address as default
router.patch('/addresses/:id/default', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.setDefaultAddress);
// DELETE remove an address
router.delete('/addresses/:id', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.deleteAddress);
// ── Superadmin: User management routes ────────────────────────────────────────
// GET  /api/v1/users          — list all users (search, role, page, limit)
router.get('/', (0, auth_1.default)(const_auth_1.USER_ROLE.superAdmin, const_auth_1.USER_ROLE.admin), controller_user_1.userControllers.getAllUsers);
// ── Profile routes (all authenticated roles) ───────────────────────────────────
// GET  /api/v1/users/me
router.get('/me', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.getMyProfile);
// PATCH /api/v1/users/me
router.patch('/me', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.updateProfile);
// POST /api/v1/users/me/change-password
router.post('/me/change-password', (0, auth_1.default)(const_auth_1.USER_ROLE.user, const_auth_1.USER_ROLE.admin, const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.changePassword);
// PATCH /api/v1/users/:id/role   — change a user's role
router.patch('/:id/role', (0, auth_1.default)(const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.updateUserRole);
// PATCH /api/v1/users/:id/block  — toggle block/unblock
router.patch('/:id/block', (0, auth_1.default)(const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.toggleBlockUser);
// DELETE /api/v1/users/:id       — permanently delete a user
router.delete('/:id', (0, auth_1.default)(const_auth_1.USER_ROLE.superAdmin), controller_user_1.userControllers.deleteUser);
exports.userRoutes = router;
