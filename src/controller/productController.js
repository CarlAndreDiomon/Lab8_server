import { Product } from "../model/productModel.js";

export const addProduct = async (req, res) => {
    const { name, description, category, price, stock, image_url } = req.body;
    
    try {
        if (
            !name ||
            !description ||
            !category ||
            !price ||
            !stock ||
            !image_url
        ) {
            return res.status(400).json({ error: "Complete All Field" });
        }

        let product = await Product.findOne({ name });
        if (product) {
            return res.status(309).json({ error: "Product already exist!" });
        }

        const newProduct = new Product({
            name,
            description,
            category,
            price,
            stock,
            image_url,
        });

        await newProduct.save();

        return res.status(201).json({
            message: "Product added successfully",
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category,
            price: newProduct.price,
            stock: newProduct.stock,
            image_url: newProduct.image_url,
            createdAt: newProduct.createdAt,
            updatedAt: newProduct.updatedAt
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        console.error("Error in add product:", error);
    }
}

export const getProduct = async (req, res) => {

};