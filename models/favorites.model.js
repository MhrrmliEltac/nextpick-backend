import mongoose from "mongoose";

const favoritesSchema = new mongoose.Schema(
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
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only favorite a product once
favoritesSchema.index({ user: 1, product: 1 }, { unique: true });

const Favorites = mongoose.model("Favorites", favoritesSchema);
export default Favorites;
