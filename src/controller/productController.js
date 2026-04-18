import { Product } from "../model/productModel.js";

export const addProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock } = req.body;
        
        let image_url = req.body.image_url;
        
    
        if (req.file) {
            image_url = `http://localhost:3000/assets/${req.file.filename}`;
        }
        
        if (
            !name ||
            !description ||
            !category ||
            !price ||
            !stock ||
            !image_url
        ) {
            return res.status(400).json({ error: "Complete All Field Including Image" });
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
            data: newProduct 
        });

    } catch (error) {
        if (error.message === 'Images only (jpeg, jpg, png, webp, gif)!') {
             return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: "Internal server error", error });
        console.error("Error in add product:", error);
    }
}

export const getProduct = async (req, res) => {
    try {

        const product = await Product.find();

        if (product === 0) {
            return res.status(404).json({ error: "No Product" });
        }
        return res.status(200).json({
            message: "Product is here.",
            count: product.length,
            data: product
        })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        console.error("Error in add product:", error);
    }
};

export const editProduct = async (req, res) => {
    try {
        const { _id, name, description, category, price, stock } = req.body;
        
        let image_url = req.body.image_url;
        
        if (req.file) {
            image_url = `http://localhost:3000/assets/${req.file.filename}`;
        }
        
        if (
            !_id ||
            !name ||
            !description ||
            !category ||
            !price ||
            !stock ||
            !image_url
        ) {
            return res.status(400).json({ error: "Complete All Field Including Image" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            _id,
            { name, description, category, price, stock, image_url },
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        if (error.message === 'Images only (jpeg, jpg, png, webp, gif)!') {
             return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: "Internal server error", error });
        console.error("Error in edit product:", error);
    }
};

export const deleteProduct = async (req, res) => {
    const {_id} = req.body;
  
    try {
        if ( !_id ) {
            return res.status(400).json({ error: "Product ID needed!" });
        }

        const product = await Product.findByIdAndDelete(_id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully", data: product });
        
    } catch (error) {
        console.error("Error in delete product:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};