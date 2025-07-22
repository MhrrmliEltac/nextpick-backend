import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import SubCategoryModel from "../models/subcategory.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      quantity,
      image,
      price,
      discount,
      discountPercent,
      rating,
      comment,
      category,
      brand,
      subcategory,
    } = req.body;

    if (!productName || !price) {
      return res
        .status(400)
        .json({ message: "Title və Price boş buraxıla bilməz" });
    }

    let discountPrice = 0;

    if (discount && discountPercent !== 0) {
      discountPrice = price - (price * discountPercent) / 100;
    }

    const newProduct = new Product({
      productName,
      productDescription,
      quantity,
      image,
      price,
      discount,
      discountPercent,
      discountPrice: discountPrice,
      rating,
      comment,
      category,
      brand,
      subcategory,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Məhsul uğurla yaradıldı", savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Məhsul yaradıla bilmədi", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .populate("brand", "brandName")
      .populate("category", "title")
      .populate("subcategory", "subcategoryName")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ message: "Məhsullar tapılmadı", error });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id tapılmadı", error });
    }

    const product = await Product.findById(id)
      .populate("brand", "brandName")
      .populate("category", "title")
      .populate("subcategory", "subcategoryName");

    if (!product) {
      return res.status(404).json({ error: "Məhsul tapılmadı" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "ID səhvdir və ya tapılmadı", error });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { title } = req.query;

    const category = await Category.findOne({ title }).select("_id");
    if (!category) {
      return res.status(404).json({ message: "Category tapılmadı" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find({ category: category._id })
      .populate("category", "title")
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};

export const getProductBySubcategory = async (req, res) => {
  try {
    const { subCategoryName, sortBy } = req.query;

    if (!subCategoryName) {
      return res.status(400).json({ message: "Alt kateqoriya tapılmadı" });
    }

    const subCategory = SubCategoryModel.findOne({ subCategoryName }).select(
      "_id"
    );

    if (!subCategory) {
      return res.status(404).json({ message: "Alt kateqoriya tapılmadı" });
    }

    let sortOptions = {};

    switch (sortBy) {
      case "asc":
        sortOptions = { price: 1 };
        break;
      case "desc":
        sortOptions = { price: -1 };
        break;
      case "a-z":
        sortOptions = { productName: 1 };
        break;
      case "z-a":
        sortOptions = { productName: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find({
      subCategory: subCategory._id,
    })
      .sort(sortOptions)
      .populate("subcategory", "subCategoryName")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Məhsul yenilənmədi", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    res.status(200).json({ message: "Məhsul silindi" });
  } catch (error) {
    res.status(500).json({ message: "Məhsul silinmədi", error });
  }
};
