import ApiKeyModel from "../models/apikey.model.js";

export const createApiKey = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      return res.status(400).json({ message: "API key is required" });
    }

    const newApiKey = new ApiKeyModel({
      key,
    });

    const savedApiKey = await newApiKey.save();
    res
      .status(201)
      .json({ message: "API key created successfully", savedApiKey });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
