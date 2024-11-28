const express = require("express");
const router = express.Router();
const { dispatcher,requestLimiter } = require("../../../middleware");
const { login,sendLoginOtp,verifyLoginOtp,resetPassword,mapNumber,registerUser,history,getOrderHistory } = require("../../../controllers/v1");

const authMiddleware = require("../../../middleware/auth");
const auth = require("../../../middleware/auth");

router.post("/login", (req, res, next) => dispatcher(req, res, next, login));
router.post("/register", (req, res, next) => dispatcher(req, res, next, registerUser));
router.post("/get-order-history", (req, res, next) => dispatcher(req, res, next, getOrderHistory));

router.post("/login-otp", (req, res, next) => dispatcher(req, res, next, sendLoginOtp));
router.post("/verify-login-otp", (req, res, next) => dispatcher(req, res, next, verifyLoginOtp));
router.post("/reset-password", (req, res, next) => dispatcher(req, res, next, resetPassword));
router.post("/map-number", (req, res, next) => dispatcher(req, res, next, mapNumber));
router.post("/history", auth,(req, res, next) => dispatcher(req, res, next, history));

module.exports = router;