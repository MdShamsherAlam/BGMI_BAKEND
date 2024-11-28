const express = require("express");
const router = express.Router();
const { dispatcher } = require("../../../middleware");
const {
    addToCart,
    getCartItems,
    removeCartItem,
    placeOrder,
    getOrderDetails,
    getOrderHistory,slotBooked
} = require("../../../controllers/v1");

// Cart Routes
router.post("/cart/add", (req, res, next) => dispatcher(req, res, next, addToCart));
router.get("/cart", (req, res, next) => dispatcher(req, res, next, getCartItems));
router.delete("/cart/remove", (req, res, next) => dispatcher(req, res, next, removeCartItem));

// Order Routes
router.post("/order", (req, res, next) => dispatcher(req, res, next, placeOrder));
router.get("/order/:orderId", (req, res, next) => dispatcher(req, res, next, getOrderDetails));
router.get("/order/history", (req, res, next) => dispatcher(req, res, next, getOrderHistory));


router.get("/slot-booked", (req, res, next) => dispatcher(req, res, next, slotBooked));

module.exports = router;
