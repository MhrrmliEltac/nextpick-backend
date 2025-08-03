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
      salesCount = 0,
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
      salesCount,
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductBySubcategory = async (req, res) => {
  try {
    const { subCategoryName, sortBy } = req.query;

    if (!subCategoryName) {
      return res
        .status(400)
        .json({ message: "Alt kateqoriya adı tələb olunur" });
    }

    const filter = {};

    if (subCategoryName.toLowerCase() !== "all laptop") {
      const subCategory = await SubCategoryModel.findOne({
        subcategoryName: subCategoryName,
      });
      if (!subCategory) {
        return res.status(404).json({ message: "Alt kateqoriya tapılmadı" });
      }

      filter.subcategory = subCategory._id;
    }

    const sortOptions = {
      asc: { price: 1 },
      desc: { price: -1 },
      "a-z": { productName: 1 },
      "z-a": { productName: -1 },
    }[sortBy] || { createdAt: -1 };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .populate("subcategory", "subcategoryName")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getProductBySearchQuery = async (req, res) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res
        .status(400)
        .json({ message: "Axtarış sorğusu boş ola bilməz" });
    }

    const filteredProducts = await Product.find({
      productName: { $regex: search, $options: "i" },
    });

    res.status(200).json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBestSellerProduct = async (req, res) => {
  try {
    const { sortBy } = req.query;

    if (!sortBy || !["asc", "desc"].includes(sortBy)) {
      return res.status(400).json({
        message: "Parametr düzgün ötürülməyib. asc və ya desc göndərin.",
      });
    }

    const mostSalesProduct = await Product.find()
      .sort({
        salesCount: sortBy === "asc" ? 1 : -1,
      })
      .limit(10);

    res.status(200).json(mostSalesProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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
