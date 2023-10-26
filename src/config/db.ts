import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const uri = process.env.DB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB connected");
  } catch (error) {
    console.log(`You have a error: ${error.message}`);
    process.exit(1);
  }
};

export { connectToDB };
