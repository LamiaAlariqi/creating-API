import { Order } from '../models/orderModel.js';
import Products from '../models/ProductModel.js';
import User from '../models/UserModel.js';

export const createOrderController = async (req, res) => {
    try {
        const { orderItems, shippingInfo, paymentInfo, taxPrice, shippingPrice, totalPrice, orderstatus } = req.body;

        // التحقق من المخزون قبل إنشاء الطلب
        for (const item of orderItems) {
            const product = await Products.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot create order. Insufficient stock. Available: ${product.stock}, Requested: ${item.quantity}`
                });
            }
        }

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

       
        const updatedStocks = await Promise.all(orderItems.map(item => updatestock(item.product, item.quantity)));

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            updatedStocks: updatedStocks,
            order
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + err.message
        });
    }
};
export const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            })
        }
        return res.status(200).json({
            success: true,
            order
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }

        )
    }
}
export const MyOrderDetails = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        if (!orders) {
            return res.status(400).json({
                success: false,
                message: "No orders found for this user"
            })
        }
        return res.status(200).json({
            success: true,
            orders
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }

        )
    }
}
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders) {
            return res.status(400).json({
                success: false,
                message: "No orders found"
            })
        }
        let total = 0
        orders.forEach(element => {
            total = total + element.totalPrice
        });
        return res.status(200).json({
            success: true,
            total,
            orders
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }

        )
    }
}
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Order not found"
            })
        }

        if (order.orderstatus === "Delivered") {
            return res.status(400).json({
                success: false,
                message: "This order has already been delivered"
            })
        }

        order.orderstatus = req.body.status;
        await order.save({ runvalidators: true });
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        })
    } catch (err) {
        return res.status(500).json({              
            success: false,
            message: "Internal server error: " + err.message
        })
    }
}

async function updatestock(id, quantity) {
    const product = await Products.findById(id);
    if (!product) {
        throw new Error("Product not found");
    }
    if (product.stock < quantity) {
        throw new Error("Insufficient stock for this product. Available: " + product.stock + ", Requested: " + quantity);
    }
    product.stock = product.stock - quantity;
    await product.save({ runvalidators: true });
    return product.stock;
}

export const deleteOrder = async (req, res) => {
    try{
const order=await Order.findById(req.params.id);
if(!order){
    return res.status(400).json({
        success:false,
        message:"Order not found"
    })
}
if(order.orderstatus!=="Delivered"){
    return res.status(400).json({
        success:false,
        message:"Cannot delete order that has not been delivered"
    })
}
await Order.deleteOne({_id:req.params.id});//الاي دي مكتوب كذا لانه ب الداتا بيز كذا
return res.status(200).json({
    success:true,
    message:"Order deleted successfully"
})  
    }
    catch(error){
        return res.status(500).json({                       
            success: false,
            message: "Internal server error: " + error.message
        })
    }
}

export const combineData = async (req, res) => {
    try {
        // جلب جميع البيانات من المجموعات المختلفة
        const users = await User.find();
        const products = await Products.find(); 
        const orders = await Order.find();

        let total = 0;

        // حساب إجمالي السعر من جميع الطلبات
        orders.forEach(element => {
            total = total + element.totalPrice;
        });

        // إرجاع النتيجة بتنسيق JSON
        return res.status(200).json({
            success: true,
            users: users.length,
            products: products.length,
            orders: orders.length,
            total
        });

    } catch (error) {
        // التعامل مع الخطأ في حال حدوثه
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Combined Data API",
            error: error.message
        });
    }
};
