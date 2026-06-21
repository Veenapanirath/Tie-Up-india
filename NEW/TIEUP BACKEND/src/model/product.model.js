// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String], // Changed from single image to array of images
      default: [],
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory:{
      type: String
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTrending: {
    type: Boolean,
    default: false
    },
    phoneno :{
      type : Number,
      require :  true
    },
    highlight:{
      type : [String],
    }
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("formattedQuantity").get(function () {
  const qty = this.quantity;
  const unit = this.unit || "";
  if (qty === undefined || qty === null) {
    return unit ? `0 ${unit}` : "0";
  }
  return unit ? `${qty} ${unit}` : String(qty);
});

export const Product = mongoose.model("Product", productSchema);
