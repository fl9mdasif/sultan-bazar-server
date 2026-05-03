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
exports.orderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_product_1 = require("../product/model.product");
const model_order_1 = require("./model.order");
const model_cart_1 = require("../cart/model.cart");
const utils_order_1 = require("./utils.order");
const const_order_1 = require("./const.order");
const service_user_1 = require("../user/service.user");
const sendEmail_1 = require("../../utils/sendEmail");
const emailTemplate_1 = require("../../helpers/emailTemplate");
const config_1 = __importDefault(require("../../config"));
// ── Place Order ────────────────────────────────────────────────────────────────
const placeOrder = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { items, shippingAddress, paymentMethod, note, discount = 0 } = payload;
    // 1. Validate stock & build order items
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
        const product = yield model_product_1.Product.findById(item.productId);
        if (!product) {
            throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, `Product not found: ${item.productId}`, 'Product not found');
        }
        const variant = product.variants.id(item.variantId);
        if (!variant) {
            throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Variant not found', 'Variant not found');
        }
        if (!variant.isAvailable || variant.stock < item.quantity) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for ${product.name} – ${variant.name}`, 'Insufficient stock');
        }
        const price = (_a = variant.discountPrice) !== null && _a !== void 0 ? _a : variant.price;
        const totalPrice = price * item.quantity;
        subtotal += totalPrice;
        orderItems.push({
            product: product._id,
            variant: {
                variantId: variant._id,
                name: variant.name,
                sku: variant.sku,
                price: variant.price,
                discountPrice: (_b = variant.discountPrice) !== null && _b !== void 0 ? _b : undefined,
            },
            quantity: item.quantity,
            totalPrice,
        });
    }
    // 2. Calculate totals
    const shippingCharge = subtotal >= const_order_1.FREE_SHIPPING_THRESHOLD ? 0 : const_order_1.SHIPPING_CHARGE;
    const totalAmount = subtotal + shippingCharge - discount;
    // 3. Create order
    const order = yield model_order_1.Order.create({
        user: userId,
        orderNumber: (0, utils_order_1.generateOrderNumber)(),
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingCharge,
        discount,
        totalAmount,
        note,
        statusHistory: [{ status: 'pending', note: 'Order placed' }],
    });
    // 4. Deduct stock
    for (const item of items) {
        yield model_product_1.Product.findOneAndUpdate({ _id: item.productId, 'variants._id': item.variantId }, { $inc: { 'variants.$.stock': -item.quantity } });
    }
    // 5. Auto-save the shipping address to the user's profile (fire-and-forget)
    service_user_1.userServices.autoSaveAddressFromOrder(userId, shippingAddress);
    // 6. Clear cart items after successful order
    yield model_cart_1.Cart.findOneAndUpdate({ user: userId }, { items: [] });
    // 7. Notify Admin via Email (Fire-and-forget)
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const populatedOrder = yield model_order_1.Order.findById(order._id).populate('items.product', 'name thumbnail');
        if (populatedOrder) {
            (0, sendEmail_1.sendEmail)(config_1.default.admin_email, `New Order Received: #${order.orderNumber}`, (0, emailTemplate_1.createAdminOrderNotificationEmail)(populatedOrder));
        }
    }))();
    return order;
});
// ── My Orders (logged-in user) ─────────────────────────────────────────────────
const getMyOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield model_order_1.Order.find({ user: userId })
        .populate('items.product', 'name thumbnail slug')
        .sort({ createdAt: -1 });
    return orders;
});
// ── Single Order ───────────────────────────────────────────────────────────────
const getOrderById = (orderId, requesterId, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield model_order_1.Order.findById(orderId)
        .populate('user', 'name email phone')
        .populate('items.product', 'name thumbnail slug');
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    // Users can only view their own orders; admins can see all
    if (order.user._id.toString() !== requesterId &&
        requesterRole !== 'admin' &&
        requesterRole !== 'superAdmin') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden', 'Access denied');
    }
    return order;
});
// ── All Orders (admin) ─────────────────────────────────────────────────────────
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, page = 1, limit = 20 } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = {};
    if (status)
        filter.orderStatus = status;
    if (query.paymentStatus)
        filter.paymentStatus = query.paymentStatus;
    if (query.search) {
        const searchTerm = query.search;
        filter.$or = [
            { orderNumber: { $regex: searchTerm, $options: 'i' } },
            { 'shippingAddress.fullName': { $regex: searchTerm, $options: 'i' } },
            { 'shippingAddress.phone': { $regex: searchTerm, $options: 'i' } },
        ];
    }
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const [orders, total] = yield Promise.all([
        model_order_1.Order.find(filter)
            .populate('user', 'name email phone')
            .populate('items.product', 'name thumbnail slug')
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        model_order_1.Order.countDocuments(filter),
    ]);
    return {
        data: orders,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
});
// ── Update Order Status (admin) ────────────────────────────────────────────────
const updateOrderStatus = (orderId, status, note) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const order = yield model_order_1.Order.findById(orderId);
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    order.orderStatus = status;
    order.statusHistory.push({ status, note, changedAt: new Date() });
    if (status === 'delivered')
        order.deliveredAt = new Date();
    if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note;
        // Restore stock on cancellation
        for (const item of order.items) {
            yield model_product_1.Product.findOneAndUpdate({ _id: item.product, 'variants._id': (_a = item.variant) === null || _a === void 0 ? void 0 : _a.variantId }, { $inc: { 'variants.$.stock': item.quantity } });
        }
    }
    yield order.save();
    // Notify User if status is "shipped"
    if (status === 'shipped') {
        const populatedOrder = yield model_order_1.Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'name thumbnail');
        if (populatedOrder && ((_b = populatedOrder.user) === null || _b === void 0 ? void 0 : _b.email)) {
            (0, sendEmail_1.sendEmail)(populatedOrder.user.email, `Your Order #${order.orderNumber} has been Shipped!`, (0, emailTemplate_1.createUserOrderShippedEmail)(populatedOrder));
        }
    }
    return order;
});
// ── Update Payment Status (admin) ──────────────────────────────────────────────
const updatePaymentStatus = (orderId, paymentStatus, transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield model_order_1.Order.findById(orderId);
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    order.paymentStatus = paymentStatus;
    if (transactionId)
        order.transactionId = transactionId;
    yield order.save();
    return order;
});
// ── Cancel Order (by user, only if still pending) ──────────────────────────────
const cancelOrder = (orderId, userId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(orderId, userId, reason);
    const order = yield model_order_1.Order.findOne({ _id: orderId, user: userId });
    // console.log(order);
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    }
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Order cannot be cancelled at this stage', 'Cannot cancel');
    }
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;
    order.statusHistory.push({ status: 'cancelled', note: reason !== null && reason !== void 0 ? reason : 'Cancelled by customer', changedAt: new Date() });
    // Restore stock
    for (const item of order.items) {
        yield model_product_1.Product.findOneAndUpdate({ _id: item.product, 'variants._id': (_a = item.variant) === null || _a === void 0 ? void 0 : _a.variantId }, { $inc: { 'variants.$.stock': item.quantity } });
    }
    yield order.save();
    return order;
});
// ── Analytics ────────────────────────────────────────────────────────────────
const getSalesAnalytics = (period) => __awaiter(void 0, void 0, void 0, function* () {
    let format = '%Y-%m-%d';
    if (period === 'monthly')
        format = '%Y-%m';
    if (period === 'yearly')
        format = '%Y';
    const pipeline = [
        {
            $match: {
                orderStatus: 'delivered',
            },
        },
        {
            $group: {
                _id: { $dateToString: { format, date: '$createdAt' } },
                revenue: { $sum: '$totalAmount' },
                orders: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ];
    const result = yield model_order_1.Order.aggregate(pipeline);
    return result.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
    }));
});
exports.orderServices = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getSalesAnalytics,
};
