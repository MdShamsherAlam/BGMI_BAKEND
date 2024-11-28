

const sequelize = require('../../../config/db');
const{Orders}=require('../../../service/v1/')

const getProducts=async(req,res,next)=>{
    try{
       const data=await new Orders().getProducts(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const getHistory=async(req,res,next)=>{
    try{
       const data=await new Orders().getHistory(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const getInvidualProductsDetails=async(req,res,next)=>{
    try{
        
       const data=await new Orders().getInvidualProductsDetails(req)
       return data;
    }
    catch(error){
        next(error)
    }
}
const takeOrder=async(req,res,next)=>{
    try{
       const data=await new Orders().takeOrders(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}


const slotBooked=async(req,res,next)=>{
    try{

       const data=await new Orders().slotBooked(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const getCart=async(req,res,next)=>{
    try{

       const data=await new Orders().getCart(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const removeItems=async(req,res,next)=>{
    try{

       const data=await new Orders().removeItems(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const paymentInitiate=async(req,res,next)=>{
    try{

       const data=await new Orders().paymentInitiate(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const handlingCallBack=async(req,res,next)=>{
    try{

       const data=await new Orders().handlingCallBack(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const generateQRCode=async(req,res,next)=>{
    try{

       const data=await new Orders().generateQRCode(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const checkPaymentStatus=async(req,res,next)=>{
    try{

       const data=await new Orders().checkPaymentStatus(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}
const matchStatus=async(req,res,next)=>{
    try{

       const data=await new Orders().matchStatus(req.body,req.user)
       return data;
    }
    catch(error){
        next(error)
    }
}

const insertProducts = async (req, res, next) => {
    try {
        const { document_saved_path, fields } = res.locals;

        console.log(document_saved_path,fields)
        const filePaths = document_saved_path ? document_saved_path.map(doc => doc.path) : [];
        fields.filePaths = filePaths; 
        let data = null
        await sequelize.transaction(async t1 => {
            data = await new Orders().insertProducts({ ...fields, filePaths }, req.user);
        });
        return data;
    } catch (error) {
        console.log(error)
        next(error);
    }
}


module.exports={
    getProducts,
    slotBooked,
    takeOrder,
    getInvidualProductsDetails,
    insertProducts,
    getHistory,
    getCart,removeItems,generateQRCode,handlingCallBack,paymentInitiate,checkPaymentStatus,matchStatus
}