import { Cart } from "../model/cartModel.js";
import { Product } from "../model/productModel.js";

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        } else {
            const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += Number(quantity);
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const userId = req.user.userId;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
            if (action === 'increase') {
                cart.items[itemIndex].quantity += 1;
            } else if (action === 'decrease') {
                cart.items[itemIndex].quantity -= 1;
                if (cart.items[itemIndex].quantity <= 0) {
                    cart.items.splice(itemIndex, 1);
                }
            }
            await cart.save();
            return res.status(200).json(cart);
        }
        res.status(404).json({ error: "Item not in cart" });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return res.status(200).json(cart);
        }
        res.status(404).json({ error: "Item not in cart" });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};

export { addToCart, updateCartQuantity, getCart, removeFromCart };