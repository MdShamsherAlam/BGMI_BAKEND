
const sequelize = require("../../../config/db");
const { ErrorHandler, statusCodes } = require("../../../helper");
const { QueryTypes, where } = require("sequelize");
const { SERVER_ERROR,PERMISSION_DENIED } = require("../../../helper/status-codes");
const { SUCCESS } = require("../../../utils/constant");
const QRCode = require('qrcode'); 



class Orders{

  
async getInvidualProductsDetails(req){
    try
    {

        const{productId}=req.params;
        console.log(req.user)
        const data=await sequelize.query('SELECT * FROM `products` WHERE product_id=?',{
            replacements:[productId],
            type:QueryTypes.SELECT
        })
        const recomendedData=await sequelize.query('SELECT * FROM `products` WHERE product_id NOT IN(?) ',{
            replacements:[productId],
            type:QueryTypes.SELECT
        })
        return {
            data,recomendedData
        }
    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}


async insertProducts(body,user){
    try{


        const{productName,productImg,productPrice,productWinningPrice,productType,productMode,rule,filePaths}=body


    
           const url=process.env.BACKEND_URL

          let file=filePaths.map(filepath=>{
            return filepath.replace("public",url,'')
          })

   
        await sequelize.query(
            `INSERT INTO products (product_name,product_img, product_entry_price, product_winning_price,product_type,product_mode) VALUES (?, ?, ?,?,?,?)`,
            {
                replacements: [productName,file,productPrice,productWinningPrice,productType,productMode,rule],
                type: QueryTypes.INSERT 
            }
        );

            return{SUCCESS}
    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}
async getProducts(body,user){
    try
    {

      const products = await sequelize.query(
        `SELECT * FROM products`,
        {
            replacements: [],
            type: QueryTypes.SELECT
        }
    );

    return products;


    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
      
    }
}
async takeOrders(body, user) {
    try {
        const{userId}=user
       
        const {  productId, ingameName1='',ingameName2='',ingameName3='',ingameName4='', timing } = body;

        await sequelize.query(
            `INSERT INTO take_orders (user_id, product_id, ingame_name_1,ingame_name_2,ingame_name_3,ingame_name_4, timing) VALUES (?, ?, ?, ?,?,?,?)`,
            {
                replacements: [userId, productId, ingameName1,ingameName2,ingameName3,ingameName4, timing],
                type: QueryTypes.INSERT 
            }
        );
        
        return SUCCESS;
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(SERVER_ERROR, error);
    }
}
async slotBooked(body, user) {
    try {
        console.log(body);
        const { userId } = user;

        for (const item of body) {
            const { order_id, product_id, product_entry_price } = item;

            await sequelize.query(
                `INSERT INTO slot_booked (user_id, order_id, product_id, entry_fee, status) 
                 VALUES (?, ?, ?, ?, ?)`,
                {
                    replacements: [userId, order_id, product_id, product_entry_price, 'PENDING'],
                    type: QueryTypes.INSERT,
                }
            );
        }

        await sequelize.query(
            `UPDATE take_orders 
             SET status = ?, is_paid = ? 
             WHERE user_id = ?`,
            {
                replacements: ['SUCCESS', 'YES', userId],
                type: QueryTypes.UPDATE,
            }
        );

        return 'SUCCESS'; // or return any constant you may want
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(SERVER_ERROR, error);
    }
}

async getHistory(body,user){
    try
    {

        const{userId}=user

        console.log(userId)

        const data = await sequelize.query(
            `SELECT p.*,tk.* FROM slot_booked  sb
            JOIN products p ON p.product_id=sb.product_id
             join take_orders tk on tk.order_id=sb.order_id
             where sb.user_id=? AND sb.is_match_done=? ORDER BY sb.created_at DESC`,
            {
                replacements: [userId,'YES'],
                type: QueryTypes.SELECT
            }
        );
    
        return data;



    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
      
    }
}


async getCart(body,user){
    try{

        const {userId}=user
         const cartData=await sequelize.query('SELECT  p.*,tr.* FROM `take_orders` tr JOIN products p ON p.product_id=tr.product_id WHERE user_id=? AND tr.status=?',{
            replacements:[userId,'PENDING'],
            type:QueryTypes.SELECT
         })

         return cartData;
    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}


async removeItems(body,user){
    try{
         const{productId}=body
         console.log("productId",productId)
        await sequelize.query('UPDATE take_orders  SET status=?  WHERE product_id=?',{
            replacements:['SUCCESS',productId]
            ,type:QueryTypes.UPDATE
        })
        return SUCCESS;

    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}

async handlingCallBack(body, user) {
    try {
        // Extract parameters from the callback request
        const paytmChecksum = body.CHECKSUMHASH;
        delete body.CHECKSUMHASH; // Remove checksum before validation
        
        // Validate the checksum using Paytm's checksum library
        const isValidChecksum = checksum_lib.verifySignature(body, process.env.PAYTM_MERCHANT_KEY, paytmChecksum);

        if (!isValidChecksum) {
            return {
                success: false,
                message: "Checksum mismatch",
            };
        }

        // Check transaction status
        if (body.STATUS === "TXN_SUCCESS") {
            // Handle successful payment
            return {
                success: true,
                message: "Payment successful",
                data: body, // Include transaction details for reference
            };
        } else if (body.STATUS === "TXN_FAILURE") {
            // Handle failed payment
            return {
                success: false,
                message: "Payment failed",
                data: body, // Include transaction details for reference
            };
        } else {
            // Handle any other unexpected status
            return {
                success: false,
                message: "Transaction status unknown",
                data: body,
            };
        }
    } catch (error) {
        console.error("Error processing Paytm callback:", error);
        throw new ErrorHandler(SERVER_ERROR, error.message || "An error occurred while processing the callback.");
    }
}

async paymentInitiate(body, user) {
    try {
        const { customerId, amount } = body;

       
        const orderId = `ORDER_${new Date().getTime()}`;

      
        const paytmParams = {
            MID: "DUMMY_MID",
            ORDER_ID: orderId,
            CUST_ID: customerId,
            TXN_AMOUNT: amount,
            CHANNEL_ID: "WEB",
            WEBSITE: "WEBSTAGING",
            INDUSTRY_TYPE_ID: "Retail",
            CALLBACK_URL: "http://localhost:5000/v1/order/callback",
            CHECKSUMHASH: "MOCK_CHECKSUM", // Mocked checksum
        };


        const txnUrl = "https://securegw-stage.paytm.in/theia/processTransaction";

        return {
            success: true,
            message: "Transaction initialized successfully (mocked)",
            txnUrl,
            paytmParams,
        };
    } catch (error) {
        console.error("Error initializing transaction (mocked):", error);
        throw new ErrorHandler(SERVER_ERROR, "Failed to initialize transaction (mocked)");
    }
}

async checkPaymentStatus(body,user){
    try{

        const {orderId}=body;
        console.log(body)
        const [{is_paid}]=await sequelize.query('SELECT * FROM take_orders WHERE order_id=?',{
            replacements:[orderId],
            type:QueryTypes.SELECT
        })
        if(is_paid==='NO'){
            throw new ErrorHandler(PERMISSION_DENIED,'PAYMENT NOT DONE YET ')
        }
return{
    data
}
    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}

async handlingCallBack(body, user) {
    try {
        const receivedParams = body;

        const isValidChecksum = true;

        if (!isValidChecksum) {
            return {
                success: false,
                message: "Checksum mismatch (mocked)",
            };
        }

  
        if (receivedParams.STATUS === "TXN_SUCCESS") {
            return {
                success: true,
                message: "Payment successful (mocked)",
                data: receivedParams,
            };
        } else if (receivedParams.STATUS === "TXN_FAILURE") {
            return {
                success: false,
                message: "Payment failed (mocked)",
                data: receivedParams,
            };
        } else {
            return {
                success: false,
                message: "Unknown transaction status (mocked)",
                data: receivedParams,
            };
        }
    } catch (error) {
        console.error("Error handling callback (mocked):", error);
        throw new ErrorHandler(SERVER_ERROR, "Error processing Paytm callback (mocked)");
    }
}

async generateQRCode(body, user) {
    try {
        const { cartData } = body;

        console.log('generate',cartData)
        // Mock transaction URL
        const txnUrl = "https://securegw-stage.paytm.in/theia/processTransaction";

        const amount = cartData.reduce((sum, product) => sum + product.product_entry_price, 0);

        console.log("totalEntryPrice",amount); // Output: 1200
        

        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
        const qrString = `${txnUrl}?MID=DUMMY_MID&ORDER_ID=${orderId}&TXN_AMOUNT=${amount}`;

       
        // Generate mock QR Code
        const qrCode = await QRCode.toDataURL(qrString);

        return {
            success: true,
            qrCode,
            message: "QR Code generated successfully (mocked)",
        };
    } catch (error) {
        console.error("Error generating QR Code (mocked):", error);
        throw new ErrorHandler(SERVER_ERROR, "Error generating QR Code (mocked)");
    }
}


async matchStatus(body,user){
    try{
          
           const{userId}=user
           
           const data = await sequelize.query(
            `SELECT sb.*, tos.*, p.* 
            FROM slot_booked sb 
            JOIN take_orders tos ON tos.order_id = sb.order_id
            JOIN products p ON p.product_id = sb.product_id 
            WHERE sb.user_id = ? AND sb.status = ? AND sb.is_match_done = ?`,
            {
                replacements: [userId, 'PENDING', 'NO'],
                type: QueryTypes.SELECT
            }
        );

        return data;
    }
    catch(error){
        console.log(error)
        throw new ErrorHandler(SERVER_ERROR,error)
    }
}

// async paymentInitiate(body,user){

//     const PAYTM_MERCHANT_ID = "RbenMI03180323104587";
//     const PAYTM_MERCHANT_KEY = "Your_Merchant_Key";
//     const PAYTM_WEBSITE = "WEBSTAGING"; // Use 'WEBSTAGING' for Sandbox, 'DEFAULT' for production.
//     const PAYTM_CHANNEL_ID = "WEB";
//     const PAYTM_INDUSTRY_TYPE = "Retail";
//     const PAYTM_CALLBACK_URL = "http://localhost:3000/api/paytm/callback";

//     const { customerId, amount } = req.body;

//     // Generate order ID
//     const orderId = `ORDER_${new Date().getTime()}`;

//     const paytmParams = {
//         MID: PAYTM_MERCHANT_ID,
//         ORDER_ID: orderId,
//         CUST_ID: customerId,
//         TXN_AMOUNT: amount,
//         CHANNEL_ID: PAYTM_CHANNEL_ID,
//         WEBSITE: PAYTM_WEBSITE,
//         INDUSTRY_TYPE_ID: PAYTM_INDUSTRY_TYPE,
//         CALLBACK_URL: PAYTM_CALLBACK_URL,
//     };

//     try {
//         const checksum = await checksum_lib.generateSignature(paytmParams, PAYTM_MERCHANT_KEY);
//         paytmParams.CHECKSUMHASH = checksum;

//         // Paytm Transaction URL (Sandbox)
//         const txnUrl = "https://securegw-stage.paytm.in/theia/processTransaction";

//      return {
//         message:"Transaction initialized",
//         txnUrl,
//         paytmParams,
//      }
            

//     } catch (err) {
//         console.error("Error generating checksum:", err);
//         res.status(500).json({
//             success: false,
//             message: "Failed to initialize transaction",
//         });
//     }

// }

// async handlingCallBack(body,user){
//     try{
//         const receivedParams = req.body;
//         const paytmChecksum = receivedParams.CHECKSUMHASH;
    
//         delete receivedParams.CHECKSUMHASH;
    
//         // Verify checksum
//         const isValidChecksum = checksum_lib.verifySignature(receivedParams, PAYTM_MERCHANT_KEY, paytmChecksum);
    
//         if (!isValidChecksum) {
//             return {
//                 success: false,
//                 message: "Checksum mismatch",
//             }
//         }
    
//         if (receivedParams.STATUS === "TXN_SUCCESS") {
//             return {
//                 success: true,
//                 message: "Payment successful",
//                 data: receivedParams,
//             }

//             }
               
    
// }
//     catch(error){
//         console.log(error)
//         throw new ErrorHandler(SERVER_ERROR,error)
//     }
// }


// async generateQRCode(body,user){
//     try{

//         const { amount, orderId } = req.query;

      
//         const txnUrl = "https://securegw-stage.paytm.in/theia/processTransaction";
    
//         const qrString = `${txnUrl}?MID=${PAYTM_MERCHANT_ID}&ORDER_ID=${orderId}&TXN_AMOUNT=${amount}`;
    

//             const qrCode = await QRCode.toDataURL(qrString);
//             return{
//                 success: true,
//                 qrCode,
//                 message: "QR Code generated successfully",
//             } 
//     }
//     catch(error){
//         console.log(error)
//         throw new ErrorHandler(SERVER_ERROR,error)
//     }
// }
}


module.exports=Orders