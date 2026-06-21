import mongoose from "mongoose";

const productDetailSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      unique: true, // Each vendor has one record
    },
    phonenos: [
      {
        type: Number,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const ProductDetail = mongoose.model("ProductDetail", productDetailSchema);
