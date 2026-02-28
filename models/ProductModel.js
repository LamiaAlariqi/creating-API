import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Should be under 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        max: [999999, "Price must be under 6 digits"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        maxLength: [5, "Stock must be under 5 digits"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            name: { type: String, required: true },
            comment: { type: String, required: true },
            rating: { type: Number, required: true },
        },
    ],
},{
    timestamps : true
})

const Products = mongoose.model("Product", productSchema);
export default Products