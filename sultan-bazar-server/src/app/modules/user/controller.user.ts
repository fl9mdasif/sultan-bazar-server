import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { response } from '../../utils/sendResponse';
import { userServices } from './service.user';

// GET /api/v1/users/addresses
const getAddresses = catchAsync(async (req, res) => {
    const result = await userServices.getAddresses(req.user.userId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Saved addresses retrieved successfully',
        data: result,
    });
});

// POST /api/v1/users/addresses
const addAddress = catchAsync(async (req, res) => {
    const result = await userServices.addAddress(req.user.userId, req.body);
    response.createSendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Address added successfully',
        data: result,
    });
});

// PATCH /api/v1/users/addresses/:id
const updateAddress = catchAsync(async (req, res) => {
    const result = await userServices.updateAddress(
        req.user.userId,
        req.params.id,
        req.body,
    );
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Address updated successfully',
        data: result,
    });
});

// DELETE /api/v1/users/addresses/:id
const deleteAddress = catchAsync(async (req, res) => {
    const result = await userServices.deleteAddress(req.user.userId, req.params.id);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Address deleted successfully',
        data: result,
    });
});

// PATCH /api/v1/users/addresses/:id/default
const setDefaultAddress = catchAsync(async (req, res) => {
    const result = await userServices.setDefaultAddress(req.user.userId, req.params.id);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Default address updated',
        data: result,
    });
});

// ── SUPERADMIN CONTROLLERS ─────────────────────────────────────────────────────

// GET /api/v1/users   (superAdmin only)
const getAllUsers = catchAsync(async (req, res) => {
    const { search, role, page, limit } = req.query as Record<string, string>;
    const result = await userServices.getAllUsers({
        search,
        role,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
    });
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});

// PATCH /api/v1/users/:id/role   (superAdmin only)
const updateUserRole = catchAsync(async (req, res) => {
    const result = await userServices.updateUserRole(
        req.params.id,
        req.user.userId,
        req.body.role,
    );
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully',
        data: result,
    });
});

// PATCH /api/v1/users/:id/block   (superAdmin only)
const toggleBlockUser = catchAsync(async (req, res) => {
    const result = await userServices.toggleBlockUser(req.params.id, req.user.userId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `User ${result?.isBlocked ? 'blocked' : 'unblocked'} successfully`,
        data: result,
    });
});

// DELETE /api/v1/users/:id   (superAdmin only)
const deleteUser = catchAsync(async (req, res) => {
    const result = await userServices.deleteUser(req.params.id, req.user.userId);
    response.createSendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
});

export const userControllers = {
    // Address management (user)
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    // User management (superAdmin)
    getAllUsers,
    updateUserRole,
    toggleBlockUser,
    deleteUser,
};
