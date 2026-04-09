import { Order } from '../models/orderModel.js';

export const createOrderController = async (req, res) => {
    try {
        const { orderItems, shippingInfo, paymentInfo, taxPrice, shippingPrice, totalPrice, orderstatus } = req.body;

        const order = await Order.create({
            orderItems,
            shippingInfo,
            paymentInfo,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderstatus,    
            user: req.user._id,
            paidAt: Date.now()
        });

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not created successfully"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order
        });             
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};