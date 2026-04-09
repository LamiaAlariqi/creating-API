// import Products from "../models/ProductModel.js";

// export const createProduct = async (req, res) => {
//     try {
//         const product = await Products.create(req.body);

//         res.status(201).json({
//             success: true,
//             product
//         });
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

import Product from "../models/ProductModel.js";
import ApiFeatures from "../util/ApiFeatures.js";

// create product 
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not created"
            })
        }

        return res.status(200).json({
            success: true,
            message: "product created successfully",
            product
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        })
    }
}

// get all products
export const getAllProducts = async (req, res) => {
 
    try {
    const apiFeature = new ApiFeatures(Product.find(), 
    req.query).search().filter().pagination();
    const products = await apiFeature.query;
    
      //  const products = await Product.find();
        return res.status(200).json({
            success: true,
            products,
            count: products.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// get single product
export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// update product
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error
        });
    }
};

// delete product
export const deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product = await Product.findByIdAndDelete(req.params.id);
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error",
            error
        });
    }
};
// export const deleteProduct = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }

//         await product.deleteOne();

//         return res.status(200).json({
//             success: true,
//             message: "Product deleted successfully"
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             error
//         });
//     }
// };

//update product 
export const updateProductController = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        return res.status(200).json({
            success: true,
            message: "product updated successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating product",
            error
        });
    }
};

// 200 => success
// 300 => warning
// 400 => human errors
// 500 => server errors