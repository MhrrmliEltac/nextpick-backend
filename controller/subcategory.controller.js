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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const bulkCreateSubCategories = async (req, res) => {
  try {
    const { subcategories } = req.body;

    if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ 
        message: "Subcategories array tələb olunur və boş olmamalıdır" 
      });
    }

    // Validate each subcategory in the array
    for (let i = 0; i < subcategories.length; i++) {
      const subcategory = subcategories[i];
      if (!subcategory.subcategoryName || !subcategory.categoryId) {
        return res.status(400).json({ 
          message: `Subcategory ${i + 1} üçün subcategoryName və categoryId tələb olunur` 
        });
      }
    }

    // Create all subcategories
    const createdSubCategories = [];
    const errors = [];

    for (let i = 0; i < subcategories.length; i++) {
      try {
        const { subcategoryName, categoryId, subCategoryImage } = subcategories[i];
        
        const newSubCategory = new SubCategoryModel({
          subcategoryName,
          categoryId,
          subCategoryImage,
        });

        const savedSubCategory = await newSubCategory.save();
        createdSubCategories.push(savedSubCategory);
      } catch (error) {
        errors.push({
          index: i,
          subcategoryName: subcategories[i].subcategoryName,
          error: error.message
        });
      }
    }

    res.status(201).json({
      message: `${createdSubCategories.length} alt kateqoriya uğurla yaradıldı`,
      createdSubCategories,
      errors: errors.length > 0 ? errors : undefined,
      totalRequested: subcategories.length,
      totalCreated: createdSubCategories.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
