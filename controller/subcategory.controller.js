import SubCategoryModel from "../models/subcategory.model.js";

export const createSubCategory = async (req, res) => {
  try {
    const { subcategoryName, categoryId, subCategoryImage } = req.body;

    if (!subcategoryName || !categoryId) {
      return res.status(400).json({ message: "Məlumatlar tam deyil" });
    }

    const newSubCategory = new SubCategoryModel({
      subcategoryName,
      categoryId,
      subCategoryImage,
    });

    const savedSubCategory = await newSubCategory.save();
    res.status(201).json({
      message: "Alt kateqoriya yaradıldı",
      subCategory: savedSubCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};

export const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategoryModel.find().populate(
      "categoryId",
      "title"
    );
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};

export const getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await SubCategoryModel.findById(id).populate(
      "categoryId",
      "categoryName"
    );

    if (!subcategory) {
      return res.status(404).json({ message: "Alt kateqoriya tapılmadı" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { title } = req.query;

    const subcategories = await SubCategoryModel.find().populate({
      path: "categoryId",
      match: { title },
      select: "title",
    });

    const filtered = subcategories.filter((item) => item.categoryId);

    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { subcategoryName, categoryId, subCategoryImage } = req.body;

    const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      { subcategoryName, categoryId, subCategoryImage },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "Alt kateqoriya tapılmadı" });
    }

    res
      .status(200)
      .json({ message: "Alt kateqoriya yeniləndi", updatedSubCategory });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubCategory = await SubCategoryModel.findByIdAndDelete(id);

    if (!deletedSubCategory) {
      return res.status(404).json({ message: "Alt kateqoriya tapılmadı" });
    }

    res.status(200).json({ message: "Alt kateqoriya silindi" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};
