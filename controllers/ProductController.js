import Products from "../models/ProductModel.js";

export const createProduct = async (req, res) => {
    try {
        const product = await Products.create(req.body);
        
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};