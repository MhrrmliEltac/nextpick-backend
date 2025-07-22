import ApiKeyModel from "../models/apikey.model.js";

export const apiKeyMiddleware = async (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key is required" });
  }

  try {
    const apiKeyRecord = await ApiKeyModel.findOne({
      key: apiKey,
      isActive: true,
    });

    if (!apiKeyRecord) {
      return res.status(403).json({ message: "Invalid or inactive API key" });
    }

    next();
  } catch (error) {
    console.error("Error validating API key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
