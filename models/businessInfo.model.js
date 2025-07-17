import mongoose, { mongo } from "mongoose";

const infoSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Info = mongoose.model("Info", infoSchema);

export default Info;
