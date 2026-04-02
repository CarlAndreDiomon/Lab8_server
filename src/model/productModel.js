import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: [
                'mens apparel', 'womens apparel', 'mobile and gadgets',
                'health and personal care', 'home and living', 'home appliances',
                'laptops and computers'
            ]
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        image_url: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }

);

const Product = mongoose.model("Product", productSchema);

export { Product };