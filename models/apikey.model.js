import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const ApiKeyModel = mongoose.model("ApiKey", apiKeySchema);

export default ApiKeyModel;
