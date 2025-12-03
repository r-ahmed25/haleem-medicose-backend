import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.HALEEM_MEDICOSE_MONGO_URI, {
    });
    console.log('MongoDB connected ' + process.env.HALEEM_MEDICOSE_MONGO_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
