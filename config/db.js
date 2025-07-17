import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB bağlantısı uğurla quruldu.");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
    process.exit(1); // serveri dayandır
  }
};

export default connectDB;
