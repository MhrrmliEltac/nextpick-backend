import mongoose from "mongoose";

const brandsSchema = new mongoose.Schema(
  {
    brandName: { type: String},
    brandImage: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brands", brandsSchema);
export default Brand;
