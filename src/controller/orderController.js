import { Order } from "../model/orderModel.js";




export const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
        const userId = req.user.userId;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const order = new Order({
            user: userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId }).populate('items.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const updateOrderStatus = async (req, res) => {
    try {
        const { status, cancelRequestStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to update order status. Admins only." });
        }

        
        if (status) {
            const allowedStatuses = ['Pending', 'Processing', 'To Ship', 'Shipped', 'Delivered', 'Cancelled'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            // Validation for Unpaid non-COD orders
            if ((status === 'Processing' || status === 'To Ship' || status === 'Shipped') && 
                order.paymentStatus === 'Unpaid' && 
                order.paymentMethod.toLowerCase() !== 'cod') {
                return res.status(400).json({ 
                    message: `Order cannot be marked as ${status} because it is unpaid and payment method is ${order.paymentMethod}.` 
                });
            }

            // Sequence validation
            if (status === 'Shipped' && order.status !== 'To Ship') {
                return res.status(400).json({ message: "Order can only be marked as Shipped if its current status is To Ship." });
            }
            if (status === 'Delivered' && order.status !== 'Shipped') {
                return res.status(400).json({ message: "Order can only be marked as Delivered if its current status is Shipped." });
            }
            if (status === 'To Ship' && order.status !== 'Processing' && order.status !== 'Pending') {
                return res.status(400).json({ message: "Order can only be marked as To Ship if its current status is Processing or Pending." });
            }
            if (status === 'Processing' && order.status !== 'Pending') {
                return res.status(400).json({ message: "Order can only be marked as Processing if its current status is Pending." });
            }

            order.status = status;

            
            if (status === 'Cancelled' && order.paymentMethod.toLowerCase() !== 'cod') {
                order.isRefunded = true; 
            }
        }

        
        if (cancelRequestStatus && order.cancelRequest && order.cancelRequest.isRequested) {
            order.cancelRequest.status = cancelRequestStatus;

            if (cancelRequestStatus === 'Approved') {
                order.status = 'Cancelled';
                
                
                if (order.paymentMethod.toLowerCase() !== 'cod') {
                    order.isRefunded = true;
                }
            } else if (cancelRequestStatus === 'Rejected') {
                
                order.cancelRequest.isRequested = false;
            }
        }

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const requestCancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to access this order" });
        }

        
        if (order.status === 'Cancelled' || order.status === 'Delivered' || order.status === 'Shipped') {
            return res.status(400).json({ message: "This order cannot be cancelled anymore because it is already shipped or completed" });
        }

        
        if (!reason || reason.trim() === '') {
            return res.status(400).json({ message: "A cancellation reason is required" });
        }

        
        order.cancelRequest = {
            isRequested: true,
            reason: reason,
            status: 'Pending'
        };

        const updatedOrder = await order.save();

        res.status(200).json({ 
            message: "Cancellation request sent to admin", 
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const payOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to access this order" });
        }

        
        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({ message: "This order is already paid" });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cannot pay for a cancelled order" });
        }

        order.paymentStatus = 'Paid';
        
        
        if (order.status === 'Pending') {
            order.status = 'Processing';
        }

        const updatedOrder = await order.save();

        res.status(200).json({ 
            message: "Payment processed successfully", 
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};




export const confirmOrderReceived = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        
        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized to access this order" });
        }

        if (order.status !== 'Delivered') {
            return res.status(400).json({ message: "You can only confirm receipt of delivered orders" });
        }
        
        if (order.isReceived) {
            return res.status(400).json({ message: "Order already confirmed as received" });
        }

        order.isReceived = true;
        
        if (order.paymentMethod.toLowerCase() === 'cod' && order.paymentStatus === 'Unpaid') {
            order.paymentStatus = 'Paid';
        }

        const updatedOrder = await order.save();

        res.status(200).json({ 
            message: "Order confirmed as received!", 
            order: updatedOrder 
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
};