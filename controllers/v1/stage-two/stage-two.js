const {  OrderService } = require("../../../service/v1");

// Cart Controllers
const addToCart = async (req, res, next) => {
    try {
        const result = await new OrderService().addToCart(req.body, req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

const getCartItems = async (req, res, next) => {
    try {
        const result = await new OrderService().getCartItems(req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

const removeCartItem = async (req, res, next) => {
    try {
        const result = await new OrderService().removeCartItem(req.body, req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

// Order Controllers
const placeOrder = async (req, res, next) => {
    try {
        const result = await new OrderService().placeOrder(req.body, req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

const getOrderDetails = async (req, res, next) => {
    try {
        const result = await new OrderService().getOrderDetails(req.params.orderId, req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

const getOrderHistory = async (req, res, next) => {
    try {
        const result = await new OrderService().getOrderHistory(req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

const slotBooked = async (req, res, next) => {
    try {
        const result = await new OrderService().slotBooked(req.user);
        return result;
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem,
    placeOrder,
    getOrderDetails,
    getOrderHistory,
    slotBooked
};
