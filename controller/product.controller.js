import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, brand, image, quantity } =
      req.body;

    if (!title || !price) {
      return res
        .status(400)
        .json({ message: "Title və Price boş buraxıla bilməz" });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      brand,
      image,
      quantity,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Məhsul uğurla yaradıldı", savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Məhsul yaradıla bilmədi", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "brandName")
      .populate("category", "title");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Məhsullar tapılmadı", error });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id tapılmadı", error });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Məhsul tapılmadı" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "ID səhvdir və ya tapılmadı", error });
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
