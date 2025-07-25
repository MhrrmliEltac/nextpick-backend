import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    productDescription: { type: String },
    quantity: { type: Number, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    discount: { type: Boolean, required: true },
    discountPercent: { type: Number },
    discountPrice: { type: Number },
    rating: { type: Number, required: true },
    comment: { type: [Object] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: false,
    },
    salesCount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
