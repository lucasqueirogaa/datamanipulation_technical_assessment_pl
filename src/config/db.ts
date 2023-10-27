import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../log/logger";

dotenv.config();

const uri = process.env.DB_URI;

const connectToDB = async () => {
  try {
    await mongoose.connect(uri, {});
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(`You have a error: ${error.message}`);
    process.exit(1);
  }
};

export { connectToDB };
