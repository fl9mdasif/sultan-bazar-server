"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const model_auth_1 = require("../auth/model.auth");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const MAX_SAVED_ADDRESSES = 5;
// ── Get all saved addresses ────────────────────────────────────────────────────
const getAddresses = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield model_auth_1.User.findById(userId).select('savedAddresses');
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    return (_a = user.savedAddresses) !== null && _a !== void 0 ? _a : [];
});
// ── Auto-save address after order placement ───────────────────────────────────
// Called internally from the order service.  Does NOT throw — failures are silent
// so they never block an already-successful order.
const autoSaveAddressFromOrder = (userId, incoming) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield model_auth_1.User.findById(userId).select('savedAddresses');
        if (!user)
            return;
        const existing = (_a = user.savedAddresses) !== null && _a !== void 0 ? _a : [];
        // Check for exact duplicate (same address + phone) — don't save twice
        const isDuplicate = existing.some((a) => a.address === incoming.address && a.phone === incoming.phone);
        if (isDuplicate)
            return;
        // If limit reached, drop the oldest non-default entry
        if (existing.length >= MAX_SAVED_ADDRESSES) {
            const oldestIndex = existing.findIndex((a) => !a.isDefault);
            if (oldestIndex !== -1) {
                existing.splice(oldestIndex, 1);
            }
            else {
                return; // all are default — respect user's choices
            }
        }
        // First address? Make it default automatically
        const makeDefault = existing.length === 0;
        yield model_auth_1.User.findByIdAndUpdate(userId, {
            $push: {
                savedAddresses: Object.assign(Object.assign({}, incoming), { isDefault: makeDefault }),
            },
        });
    }
    catch (_b) {
        // silent — do not break the order flow
    }
});
// ── Add address manually ───────────────────────────────────────────────────────
const addAddress = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield model_auth_1.User.findById(userId).select('savedAddresses');
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    const existing = (_a = user.savedAddresses) !== null && _a !== void 0 ? _a : [];
    if (existing.length >= MAX_SAVED_ADDRESSES) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Maximum ${MAX_SAVED_ADDRESSES} addresses allowed`, 'Address limit reached');
    }
    // If this is set as default, clear others first
    if (data.isDefault) {
        yield model_auth_1.User.updateOne({ _id: userId }, { $set: { 'savedAddresses.$[].isDefault': false } });
    }
    // Auto-default if it's the first address
    const isDefault = existing.length === 0 ? true : ((_b = data.isDefault) !== null && _b !== void 0 ? _b : false);
    const updated = yield model_auth_1.User.findByIdAndUpdate(userId, { $push: { savedAddresses: Object.assign(Object.assign({}, data), { isDefault }) } }, { new: true, select: 'savedAddresses' });
    return updated === null || updated === void 0 ? void 0 : updated.savedAddresses;
});
// ── Update a specific address ──────────────────────────────────────────────────
const updateAddress = (userId, addressId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // If marking as default, unset all others first
    if (data.isDefault) {
        yield model_auth_1.User.updateOne({ _id: userId }, { $set: { 'savedAddresses.$[].isDefault': false } });
    }
    const result = yield model_auth_1.User.findOneAndUpdate({ _id: userId, 'savedAddresses._id': addressId }, {
        $set: Object.fromEntries(Object.entries(data).map(([k, v]) => [`savedAddresses.$.${k}`, v])),
    }, { new: true, select: 'savedAddresses' });
    if (!result) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Address not found', 'Address not found');
    }
    return result.savedAddresses;
});
// ── Delete a specific address ──────────────────────────────────────────────────
const deleteAddress = (userId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield model_auth_1.User.findByIdAndUpdate(userId, { $pull: { savedAddresses: { _id: addressId } } }, { new: true, select: 'savedAddresses' });
    if (!result) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    }
    return result.savedAddresses;
});
// ── Set default address ────────────────────────────────────────────────────────
const setDefaultAddress = (userId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    // Unset all
    yield model_auth_1.User.updateOne({ _id: userId }, { $set: { 'savedAddresses.$[].isDefault': false } });
    // Set the chosen one
    const result = yield model_auth_1.User.findOneAndUpdate({ _id: userId, 'savedAddresses._id': addressId }, { $set: { 'savedAddresses.$.isDefault': true } }, { new: true, select: 'savedAddresses' });
    if (!result) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Address not found', 'Address not found');
    }
    return result.savedAddresses;
});
// ── SUPERADMIN: Get all users (with search & pagination) ──────────────────────
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { search, role, page = 1, limit = 20 } = query;
    const filter = {};
    if (search) {
        filter.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { contactNumber: { $regex: search, $options: 'i' } },
        ];
    }
    if (role)
        filter.role = role;
    if (query.isBlocked !== undefined) {
        filter.isBlocked = query.isBlocked === 'true' || query.isBlocked === true;
    }
    const total = yield model_auth_1.User.countDocuments(filter);
    const users = yield model_auth_1.User.find(filter)
        .select('-password -savedAddresses')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
});
// ── SUPERADMIN: Update a user's role ─────────────────────────────────────────
const updateUserRole = (targetId, callerId, newRole) => __awaiter(void 0, void 0, void 0, function* () {
    if (targetId === callerId) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Cannot change your own role', 'Self-operation not allowed');
    }
    const user = yield model_auth_1.User.findByIdAndUpdate(targetId, { role: newRole }, { new: true, select: '-password -savedAddresses' });
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    return user;
});
// ── SUPERADMIN: Toggle block/unblock a user ───────────────────────────────────
const toggleBlockUser = (targetId, callerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (targetId === callerId) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Cannot block yourself', 'Self-operation not allowed');
    }
    const user = yield model_auth_1.User.findById(targetId).select('isBlocked');
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    const updated = yield model_auth_1.User.findByIdAndUpdate(targetId, { isBlocked: !user.isBlocked }, { new: true, select: '-password -savedAddresses' });
    return updated;
});
// ── SUPERADMIN: Delete a user ─────────────────────────────────────────────────
const deleteUser = (targetId, callerId) => __awaiter(void 0, void 0, void 0, function* () {
    if (targetId === callerId) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Cannot delete yourself', 'Self-operation not allowed');
    }
    const user = yield model_auth_1.User.findByIdAndDelete(targetId);
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    return { deleted: true, userId: targetId };
});
// ── PROFILE: Get own profile ─────────────────────────────────────────────────
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_auth_1.User.findById(userId).select('-password -savedAddresses').lean();
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    return user;
});
// ── PROFILE: Update own profile fields ───────────────────────────────────────
const updateProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // If changing username, ensure it's not already taken by another user
    if (data.username) {
        const existing = yield model_auth_1.User.findOne({ username: data.username, _id: { $ne: userId } });
        if (existing) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'Username already taken', 'Username conflict');
        }
    }
    const updated = yield model_auth_1.User.findByIdAndUpdate(userId, { $set: data }, { new: true, select: '-password -savedAddresses' });
    if (!updated)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    return updated;
});
// ── PROFILE: Change password ──────────────────────────────────────────────────
const changePassword = (userId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_auth_1.User.findById(userId).select('+password');
    if (!user)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found', 'User not found');
    // Verify old password
    const matched = yield model_auth_1.User.isPasswordMatched(oldPassword, user.password);
    if (!matched) {
        throw new AppErrors_1.default(http_status_1.default.UNAUTHORIZED, 'Current password is incorrect', 'Wrong password');
    }
    if (oldPassword === newPassword) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'New password must differ from the current one', 'Same password');
    }
    const bcrypt = yield Promise.resolve().then(() => __importStar(require('bcrypt')));
    const hashed = yield bcrypt.hash(newPassword, 12);
    yield model_auth_1.User.findByIdAndUpdate(userId, {
        password: hashed,
        passwordChangedAt: new Date(),
    });
    return { success: true, message: 'Password changed successfully' };
});
exports.userServices = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    autoSaveAddressFromOrder,
    // ── Profile ───────────────────────────────────────────────────────
    getMyProfile,
    updateProfile,
    changePassword,
    // ── Superadmin ────────────────────────────────────────────────────
    getAllUsers,
    updateUserRole,
    toggleBlockUser,
    deleteUser,
};
