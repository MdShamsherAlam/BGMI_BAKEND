
const express = require("express");
const router = express.Router();
const { dispatcher,requestLimiter,fileUpload } = require("../../../middleware");
const{auth}=require('../../../middleware')

const{getProducts,
    slotBooked,
    takeOrder,getInvidualProductsDetails,insertProducts,getHistory,getCart,removeItems,matchStatus,generateQRCode,handlingCallBack,paymentInitiate,checkPaymentStatus}=require('../../../controllers/v1')

router.get("/get-products", (req, res, next) => dispatcher(req, res, next, getProducts));
router.post("/get-history",auth, (req, res, next) => dispatcher(req, res, next, getHistory));
router.post("/take-order", auth,(req, res, next) => dispatcher(req, res, next, takeOrder));
router.post("/slot-booked",auth, (req, res, next) => dispatcher(req, res, next, slotBooked));
router.post("/get-cart",auth, (req, res, next) => dispatcher(req, res, next, getCart));
router.post("/remove-items",auth, (req, res, next) => dispatcher(req, res, next, removeItems));
router.get("/get-products-details/:productId", (req, res, next) => dispatcher(req, res, next, getInvidualProductsDetails));
router.post("/payment-initiate", (req, res, next) => dispatcher(req, res, next, paymentInitiate));
router.post("/callback", (req, res, next) => dispatcher(req, res, next, handlingCallBack));
router.post("/generate-qr-code", (req, res, next) => dispatcher(req, res, next, generateQRCode));
router.post("/check-payment-status", (req, res, next) => dispatcher(req, res, next, checkPaymentStatus));
router.post("/match-status",auth, (req, res, next) => dispatcher(req, res, next, matchStatus));

router.post("/file", (req, res, next) => fileUpload(req, res, next, { appendDate: false, pathKey: "productName" }), (req, res, next) => dispatcher(req, res, next, insertProducts))


module.exports = router;