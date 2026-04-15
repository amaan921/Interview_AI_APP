import mongoose from "mongoose";

//dotenv.config();
const connectDB = async () => {
  const uri = process.env.MONGODB_URL;
  if (typeof uri !== 'string' || uri.length === 0) {
    console.error('MongoDB connection error: MONGODB_URL is not defined or not a string');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};

export default connectDB;