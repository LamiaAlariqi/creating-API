import express from 'express';
const OrderRouter = express.Router();
import { createOrderController, getSingleOrder, MyOrderDetails, getAllOrders, updateOrderStatus, deleteOrder } from '../controllers/OrderController.js';
import { isAuthenticatedUser, isAdmin } from '../util/userAuth.js';

OrderRouter.post('/newOrder', isAuthenticatedUser, createOrderController);
OrderRouter.get('/order_details/:id',isAuthenticatedUser,isAdmin("admin"),getSingleOrder);
OrderRouter.get('/get_my_orders',isAuthenticatedUser,MyOrderDetails);
OrderRouter.get('/all_orders',isAuthenticatedUser,isAdmin("admin"),getAllOrders);
OrderRouter.put('/update_order_status/:id',isAuthenticatedUser,isAdmin("admin"),updateOrderStatus);
OrderRouter.delete('/delete_order/:id', isAuthenticatedUser, isAdmin("admin"), deleteOrder);
export default OrderRouter;
