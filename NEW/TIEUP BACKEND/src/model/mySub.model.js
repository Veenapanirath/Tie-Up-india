import mongoose from "mongoose";

const mySubSchema = new mongoose.Schema({
    sub: {
        type: mongoose.Types.ObjectId,
        ref: "Subscription",
        required: true
    },
    vendor: {
        type: mongoose.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    remainingProductCount: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    status:{
        type: String,
        enum: ["expired", "active"],
    },
    razorpayOrderId: String,
    razorpayPaymentId: String
}, { timestamps: true });

export const MySubscription = mongoose.model("MySubscription", mySubSchema);
