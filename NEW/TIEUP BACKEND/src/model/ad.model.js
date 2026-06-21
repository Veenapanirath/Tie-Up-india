import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    backgroundColor: { type: String, default: "from-gray-600 to-gray-800" },
    isActive: { type: Boolean, default: true }, // admin can enable/disable
  },
  { timestamps: true }
);

export const Ad = mongoose.model("Ad", adSchema);
