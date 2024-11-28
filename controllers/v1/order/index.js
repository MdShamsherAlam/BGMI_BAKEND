
const {getProducts,
    slotBooked,
    takeOrder,getInvidualProductsDetails,insertProducts,getHistory,getCart,removeItems,generateQRCode,handlingCallBack,paymentInitiate,checkPaymentStatus,matchStatus}=require('./order')

module.exports={
    getProducts,
    slotBooked,
    takeOrder,getInvidualProductsDetails,insertProducts,getHistory,checkPaymentStatus,getCart,removeItems,generateQRCode,handlingCallBack,paymentInitiate,matchStatus
}