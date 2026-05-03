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
exports.cartControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const service_cart_1 = require("./service.cart");
const addToCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield service_cart_1.cartServices.addToCart(userId, req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product added to cart successfully',
        data: result,
    });
}));
const getCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield service_cart_1.cartServices.getCart(userId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cart retrieved successfully',
        data: result,
    });
}));
const updateCartItemQuantity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId, variantId } = req.params;
    const { quantity } = req.body;
    const result = yield service_cart_1.cartServices.updateCartItemQuantity(userId, productId, variantId, quantity);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cart item quantity updated successfully',
        data: result,
    });
}));
const removeFromCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const { productId, variantId } = req.params;
    const result = yield service_cart_1.cartServices.removeFromCart(userId, productId, variantId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product removed from cart successfully',
        data: result,
    });
}));
const clearCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield service_cart_1.cartServices.clearCart(userId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Cart cleared successfully',
        data: result,
    });
}));
exports.cartControllers = {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
};
