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
exports.orderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const service_order_1 = require("./service.order");
// POST /api/orders  — logged-in user places an order
const placeOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const result = yield service_order_1.orderServices.placeOrder(userId, req.body);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: result,
    });
}));
// GET /api/orders/my-orders  — logged-in user's own orders
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.getMyOrders(req.user._id);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result,
    });
}));
// GET /api/orders/:orderId  — single order (owner or admin)
const getOrderById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.getOrderById(req.params.orderId, req.user._id, req.user.role);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
// GET /api/orders  — admin: all orders with optional filters & pagination
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_order_1.orderServices.getAllOrders(req.query);
    sendResponse_1.response.getSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
}));
// PATCH /api/orders/:orderId/status  — admin updates lifecycle status
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, note } = req.body;
    const result = yield service_order_1.orderServices.updateOrderStatus(req.params.orderId, status, note);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
}));
// PATCH /api/orders/:orderId/payment-status  — admin updates payment status
const updatePaymentStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentStatus, transactionId } = req.body;
    const result = yield service_order_1.orderServices.updatePaymentStatus(req.params.orderId, paymentStatus, transactionId);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payment status updated successfully',
        data: result,
    });
}));
// PATCH /api/orders/:orderId/cancel  — logged-in user cancels their own order
const cancelOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reason } = req.body;
    const result = yield service_order_1.orderServices.cancelOrder(req.params.orderId, req.user._id, reason);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order cancelled successfully',
        data: result,
    });
}));
// GET /api/orders/analytics/sales — admin gets sales chart data
const getSalesAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const period = req.query.period || 'monthly';
    const result = yield service_order_1.orderServices.getSalesAnalytics(period);
    sendResponse_1.response.createSendResponse(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Sales analytics retrieved successfully',
        data: result,
    });
}));
exports.orderControllers = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getSalesAnalytics,
};
