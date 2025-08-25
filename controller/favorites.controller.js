import Favorites from "../models/favorites.model.js";
import Product from "../models/product.model.js";

// Add product to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // From JWT token

    if (!productId) {
      return res.status(400).json({ message: "Məhsul ID-si tələb olunur" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    // Check if already in favorites
    const existingFavorite = await Favorites.findOne({
      user: userId,
      product: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Məhsul artıq favorilərdədir" });
    }

    // Add to favorites
    const newFavorite = new Favorites({
      user: userId,
      product: productId,
    });

    await newFavorite.save();

    res.status(201).json({ 
      message: "Məhsul favorilərə əlavə edildi",
      favorite: newFavorite 
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ message: "Favorilərə əlavə edilə bilmədi", error: error.message });
  }
};

// Remove product from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id; // From JWT token

    if (!productId) {
      return res.status(400).json({ message: "Məhsul ID-si tələb olunur" });
    }

    // Remove from favorites
    const deletedFavorite = await Favorites.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!deletedFavorite) {
      return res.status(404).json({ message: "Favorilərdə belə məhsul tapılmadı" });
    }

    res.status(200).json({ message: "Məhsul favorilərdən silindi" });
  } catch (error) {
    console.error("Remove from favorites error:", error);
    res.status(500).json({ message: "Favorilərdən silinə bilmədi", error: error.message });
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT token
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Get total count
    const totalFavorites = await Favorites.countDocuments({ user: userId });

    // Get favorites with product details
    const favorites = await Favorites.find({ user: userId })
      .populate({
        path: "product",
        populate: [
          { path: "brand", select: "brandName" },
          { path: "category", select: "title" },
          { path: "subcategory", select: "subcategoryName" }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      favorites,
      totalFavorites,
      totalPages: Math.ceil(totalFavorites / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: "Favorilər tapılmadı", error: error.message });
  }
};

// Check if product is in user's favorites
export const checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id; // From JWT token

    if (!productId) {
      return res.status(400).json({ message: "Məhsul ID-si tələb olunur" });
    }

    const favorite = await Favorites.findOne({
      user: userId,
      product: productId,
    });

    res.status(200).json({
      isFavorite: !!favorite,
      favoriteId: favorite ? favorite._id : null
    });
  } catch (error) {
    console.error("Check favorite status error:", error);
    res.status(500).json({ message: "Favori statusu yoxlanıla bilmədi", error: error.message });
  }
};
