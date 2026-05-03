"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const service_user_1 = require("./service.user");
// GET /api/v1/users/addresses
const getAddresses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.getAddresses(req.user._id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Saved addresses retrieved successfully',
        data: result,
    });
}));
// POST /api/v1/users/addresses
const addAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.addAddress(req.user._id, req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Address added successfully',
        data: result,
    });
}));
// PATCH /api/v1/users/addresses/:id
const updateAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.updateAddress(req.user._id, req.params.id, req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Address updated successfully',
        data: result,
    });
}));
// DELETE /api/v1/users/addresses/:id
const deleteAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.deleteAddress(req.user._id, req.params.id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Address deleted successfully',
        data: result,
    });
}));
// PATCH /api/v1/users/addresses/:id/default
const setDefaultAddress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.setDefaultAddress(req.user._id, req.params.id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Default address updated',
        data: result,
    });
}));
// ── SUPERADMIN CONTROLLERS ─────────────────────────────────────────────────────
// GET /api/v1/users   (superAdmin only)
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, role, page, limit, isBlocked } = req.query;
    const result = yield service_user_1.userServices.getAllUsers({
        search,
        role,
        isBlocked,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
    });
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
}));
// PATCH /api/v1/users/:id/role   (superAdmin only)
const updateUserRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.updateUserRole(req.params.id, req.user._id, req.body.role);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
}));
// PATCH /api/v1/users/:id/block   (superAdmin only)
const toggleBlockUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.toggleBlockUser(req.params.id, req.user._id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `User ${(result === null || result === void 0 ? void 0 : result.isBlocked) ? 'blocked' : 'unblocked'} successfully`,
        data: result,
    });
}));
// DELETE /api/v1/users/:id   (superAdmin only)
const deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.deleteUser(req.params.id, req.user._id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
// ── PROFILE CONTROLLERS ───────────────────────────────────────────────────────
// GET /api/v1/users/me
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.user)
    const result = yield service_user_1.userServices.getMyProfile(req.user._id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
// PATCH /api/v1/users/me
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_user_1.userServices.updateProfile(req.user._id, req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
}));
// POST /api/v1/users/me/change-password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    const result = yield service_user_1.userServices.changePassword(req.user._id, oldPassword, newPassword);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.userControllers = {
    // Address management (user)
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    // Profile (all roles)
    getMyProfile,
    updateProfile,
    changePassword,
    // User management (superAdmin)
    getAllUsers,
    updateUserRole,
    toggleBlockUser,
    deleteUser,
};
