import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
    },
    phoneNo: {
      type: Number,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["waiting", "in process", "done"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model("Enquiry", enquirySchema);