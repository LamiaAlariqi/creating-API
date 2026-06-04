import express from "express";
import {
    createProducts,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    updateProductController
    
} from "../controllers/ProductController.js";
import { isAuthenticatedUser, isAdmin } from "../util/userAuth.js";

const router = express.Router();

// مَسَارات المُنتجات (Product Routes)
router.post("/product/new", isAuthenticatedUser, isAdmin("admin"), createProducts);
router.get("/products", getAllProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);
router.put("/product/update/:id", updateProductController);

export default router;
