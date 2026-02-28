import express from "express";
import { createProduct } from "../controllers/productcontroller.js";

const router = express.Router();

// نحدد المسار ونربطه بالدالة التي أنشأناها في الكونتيرولر
router.post("/product/new", createProduct);

export default router;
// productRoute.js
