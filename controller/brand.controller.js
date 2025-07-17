import Brand from "../models/brand.model.js";

export const createBrands = async (req, res) => {
  try {
    const { brandName, brandImage } = req.body;

    if (!brandName && !brandImage) {
      return res
        .status(400)
        .json({ message: "Brand adı və ya şəkil əlavə edilməyib" });
    }

    const newBrand = new Brand({
      brandName,
      brandImage,
    });

    const savedBrand = await newBrand.save();
    res.status(201).json({ message: "Brand uğurla yaradıldı", savedBrand });
  } catch (error) {
    res.status(500).json({ message: "Brand yaradıla bilmədi", error });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const getAllBrand = await Brand.find();
    res.status(200).json(getAllBrand);
  } catch (error) {
    res.status(500).json({ message: "Brand tapılmadı", error });
  }
};
