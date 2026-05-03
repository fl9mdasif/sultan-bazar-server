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
exports.cartServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const model_product_1 = require("../product/model.product");
const model_cart_1 = require("./model.cart");
const mongoose_1 = require("mongoose");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const addToCart = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, variantId, quantity } = payload;
    // Check if product exists
    const product = yield model_product_1.Product.findById(productId);
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    // Check if variant exists in the product
    const variant = product.variants.find((v) => { var _a; return ((_a = v._id) === null || _a === void 0 ? void 0 : _a.toString()) === variantId || v.sku === variantId; });
    // Note: Using find might depend on whether variantId is an actual ObjectId or a string SKU.
    // Given the interface, it's likely an ObjectId.
    if (!variant) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product variant not found');
    }
    // Find user's cart
    let cart = yield model_cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        // Create new cart
        cart = yield model_cart_1.Cart.create({
            user: userId,
            items: [{ product: productId, variantId, quantity }],
        });
    }
    else {
        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.variantId.toString() === variantId);
        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity += quantity;
        }
        else {
            // Add new item
            cart.items.push({ product: new mongoose_1.Types.ObjectId(productId), variantId: new mongoose_1.Types.ObjectId(variantId), quantity });
        }
        yield cart.save();
    }
    return cart;
});
const getCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield model_cart_1.Cart.findOne({ user: userId }).populate({
        path: 'items.product',
        select: 'name thumbnail variants slug',
    });
    return cart;
});
const updateCartItemQuantity = (userId, productId, variantId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield model_cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId && item.variantId.toString() === variantId);
    if (itemIndex === -1) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Item not found in cart');
    }
    cart.items[itemIndex].quantity = quantity;
    yield cart.save();
    return cart;
});
const removeFromCart = (userId, productId, variantId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield model_cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    cart.items = cart.items.filter((item) => !(item.product.toString() === productId && item.variantId.toString() === variantId));
    yield cart.save();
    return cart;
});
const clearCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield model_cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Cart not found');
    }
    cart.items = [];
    yield cart.save();
    return cart;
});
exports.cartServices = {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
};
