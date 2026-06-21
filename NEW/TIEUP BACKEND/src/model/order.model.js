// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          
        },
        price: {
          type: Number,
          
        },
      },
    ],
    // shippingAddress: {
    //   address: { type: String, required: true },
    //   city: { type: String, required: true },
    //   state: { type: String },
    //   postalCode: { type: String, required: true },
    //   country: { type: String, required: true },
    // },
    status: {
      type: String,
      enum: ["new", "in-progress", "resolved", "closed"],
      default: "new",
    },
    totalPrice: {
      type: Number,
      
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
