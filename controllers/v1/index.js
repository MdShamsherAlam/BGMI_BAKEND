
const { login,verifyLoginOtp,sendLoginOtp,resetPassword,mapNumber,registerUser,history,getOrderHistory} = require("./auth")
const { addToCart,
  getCartItems,
  removeCartItem,
  placeOrder,
  getOrderDetails
  } = require('./stage-two')


  const{getProducts,
    slotBooked,
    takeOrder,getInvidualProductsDetails,insertProducts,getHistory,getCart,removeItems,generateQRCode,handlingCallBack,paymentInitiate,checkPaymentStatus,matchStatus}=require('./order')


module.exports = {
  login,verifyLoginOtp,sendLoginOtp,resetPassword,mapNumber,registerUser,history,addToCart,
  getCartItems,
  removeCartItem,
  placeOrder,
  getOrderDetails,
  getOrderHistory,getProducts,
  slotBooked,matchStatus,
  takeOrder,
  getInvidualProductsDetails,insertProducts,getHistory,getCart,removeItems,generateQRCode,handlingCallBack,paymentInitiate,checkPaymentStatus
};