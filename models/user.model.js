import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
      name: {type: String},
      surname: {type: String},
      phoneNumber: {type: String},
      email: {
          type: String,
          required: true,
          unique: true,
      },
      password: {type: String,},
      birthDate: {type: Date},
      otpCode: {type: String},
      otpExpiry: {type: Date},
      isVerified: {type: Boolean, default: false},
      role: {type: String, default: "USER"},
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
