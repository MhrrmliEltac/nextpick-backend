import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    subcategoryName: { type: String, required: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryImage: { type: String, required: true },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default SubCategoryModel;
