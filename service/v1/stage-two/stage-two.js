const sequelize = require("../../../config/db");
const redisClient = require('../../../config/cache'); 
const { QueryTypes } = require("sequelize");
const { ErrorHandler, statusCodes } = require("../../../helper");
const { SUCCESS } = require("../../../utils/constant");
const { SERVER_ERROR, NOT_FOUND } = statusCodes;

class OrderService {
    async placeOrder(data, user) {
        try {
            const { cartItems, paymentMethod } = data;

            // Create an order entry
            const [order] = await sequelize.query(
                `INSERT INTO orders (user_id, payment_method, order_status) VALUES (?, ?, 'PENDING')`,
                { replacements: [user.id, paymentMethod], type: QueryTypes.INSERT }
            );

            // Move items from cart to order items
            const orderId = order[0];
            const promises = cartItems.map(item =>
                sequelize.query(
                    `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`,
                    { replacements: [orderId, item.productId, item.quantity], type: QueryTypes.INSERT }
                )
            );

            await Promise.all(promises);

            // Clear the user's cart
            await sequelize.query(`DELETE FROM cart WHERE user_id = ?`, {
                replacements: [user.id],
                type: QueryTypes.DELETE,
            });

            return { message: "Order placed successfully", orderId };
        } catch (error) {
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    }

    async getOrderDetails(orderId, user) {
        try {
            const order = await sequelize.query(
                `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
                { replacements: [orderId, user.id], type: QueryTypes.SELECT }
            );
            if (!order.length) throw new ErrorHandler(NOT_FOUND, "Order not found");

            const orderItems = await sequelize.query(
                `SELECT * FROM order_items WHERE order_id = ?`,
                { replacements: [orderId], type: QueryTypes.SELECT }
            );

            return { order: order[0], items: orderItems };
        } catch (error) {
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    }

    // async getOrderHistory(user) {
    //     try {
    //         const orders = await sequelize.query(
    //             `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
    //             { replacements: [user.id], type: QueryTypes.SELECT }
    //         );
    //         return orders;
    //     } catch (error) {
    //         throw new ErrorHandler(SERVER_ERROR, error);
    //     }
    // }

    async  getOrderHistory(user, page = 1, limit = 10) {

        console.log("working")
        const offset = (page - 1) * limit;
        const cacheKey = `orderHistory:user:${user.id}:page:${page}:limit:${limit}`;
        
        try {
            // Check if data is in Redis
            const cachedOrders = await redisClient.get(cacheKey);
    
            if (cachedOrders) {
                return JSON.parse(cachedOrders); // Return parsed cached data
            }
    
            // If not in cache, fetch from database
            const orders = await sequelize.query(
                `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
                {
                    replacements: [user.id, limit, offset],
                    type: QueryTypes.SELECT
                }
            );
    
            // Cache the fetched data in Redis for 1 hour (3600 seconds)
            redisClient.setex(cacheKey, 3600, JSON.stringify(orders));
    
            return orders;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(SERVER_ERROR, error.message);
        }
    }
    

    
    async addToCart(data, user) {
        try {
            const { productId, quantity } = data;
            await sequelize.query(
                `INSERT INTO cart (user_id, product_id, quantity) 
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
                {
                    replacements: [user.id, productId, quantity, quantity],
                    type: QueryTypes.INSERT,
                }
            );
            return SUCCESS;
        } catch (error) {
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    }

   
    async getCartItems(user) {
        try {
            const items = await sequelize.query(
                `SELECT * FROM cart WHERE user_id = ?`,
                { replacements: [user.id], type: QueryTypes.SELECT }
            );
            return items;
        } catch (error) {
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    }

   
    async removeCartItem(data, user) {
        try {
            const { productId } = data;
            await sequelize.query(
                `DELETE FROM cart WHERE user_id = ? AND product_id = ?`,
                { replacements: [user.id, productId], type: QueryTypes.DELETE }
            );
            return SUCCESS;
        } catch (error) {
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    }

        async slotBooked(body,user){
            try{
                 

                const{bgmiId,bgmiName,bgmiType,bgmiMode,bgmiWeapon,price,timing}=body
                
                const {uuid}=user

                 await sequelize.query(
                    `INSERT INTO slot_book (user_id,bgmi_id,bgmi_name,bgmi_type,bgmi_mode,bgmi_weapon,price,timing) VALUES (?, ?, ?,?,?,?,?)`,
                    { replacements: [uuid,bgmiId,bgmiName,bgmiType,bgmiMode,bgmiWeapon,price,timing ], type: QueryTypes.INSERT }
                );
                   return SUCCESS

            }
            catch(error){
                console.log(error)
                throw new ErrorHandler(SERVER_ERROR,error)
            }
        }
    



        async update(body,user){
            try{
                const { productId, quantity } = data;
                await sequelize.query(
                    `INSERT INTO cart (user_id, product_id, quantity) 
                    VALUES (?, ?, ?)
                    ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
                    {
                        replacements: [user.id, productId, quantity, quantity],
                        type: QueryTypes.INSERT,
                    }
                );
                return SUCCESS;
            }
            catch(error){
                console.log(error)
                throw new ErrorHandler(SERVER_ERROR,error)
            }
        }




        

}

module.exports = { OrderService };
