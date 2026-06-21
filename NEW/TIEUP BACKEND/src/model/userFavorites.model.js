import mongoose from "mongoose";

const userFavoritesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can't add the same product twice
userFavoritesSchema.index({ user: 1, product: 1 }, { unique: true });

export const UserFavorites = mongoose.model("UserFavorites", userFavoritesSchema);
