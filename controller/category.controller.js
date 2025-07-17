import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { title, icon } = req.body;

    if (!title && !icon) {
      return res
        .status(400)
        .json({ message: "Kateqoriya adını və ikon təyin edin" });
    }

    const newCategory = new Category({
      title,
      icon,
    });

    const savedCategory = await newCategory.save();
    res
      .status(201)
      .json({ message: "Kateqoriya uğurla yaradıldı", savedCategory });
  } catch (error) {
    res.status(500).json({ message: "Məhsul yaradıla bilmədi", error });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Kateqoriya tapılmadı", error });
  }
};

export const getOneCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID səhvdir", error });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Kateqoriya tapılmadı" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "ID səhvdir və ya tapılmadı", error });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateCategory) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "ID səhvdir və ya tapılmadı", error });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id tapılmadı", error });
    }

    const deleteCategory = await Category.findByIdAndDelete(id);

    if (!deleteCategory) {
      return res.status(404).json({ message: "Belə kateqoriya yoxdur", error });
    }

    res.status(200).json({ message: "Kateqoriya silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kateqoriya id yanlışdır", error });
  }
};
