import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [orderItemSchema],
        totalAmount: {
            type: Number,
            required: true
        },
        shippingAddress: {
            type: String,
            required: true
        },
        paymentMethod: {
            type: String,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['Unpaid', 'Paid'],
            default: 'Unpaid'
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'To Ship', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        cancelRequest: {
            isRequested: { type: Boolean, default: false },
            reason: { type: String, default: "" },
            status: { type: String, enum: ['None', 'Pending', 'Approved', 'Rejected'], default: 'None' }
        },
        isRefunded: {
            type: Boolean,
            default: false
        },
        isReceived: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export { Order };