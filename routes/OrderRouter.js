import express from 'express';
const OrderRouter = express.Router();
import { createOrderController } from '../controllers/OrderController.js';
import { isAuthenticatedUser, isAdmin } from '../util/userAuth.js';

OrderRouter.post('/newOrder', isAuthenticatedUser, createOrderController);

export default OrderRouter;
