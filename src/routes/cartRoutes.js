import express from "express";
import { addToCart, updateCartQuantity, getCart, removeFromCart } from "../controller/cartController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.put("/quantity", protect, updateCartQuantity);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);

export default router;