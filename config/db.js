import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.HALEEM_MEDICOSE_MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds for server selection
      socketTimeoutMS: 45000, // 45 seconds for socket timeout
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 10000, // 10 seconds for initial connection
      family: 4, // Use IPv4
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit immediately in production, retry connection
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
