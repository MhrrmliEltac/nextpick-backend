import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
