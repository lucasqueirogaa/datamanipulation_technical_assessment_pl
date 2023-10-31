import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../log/logger";

dotenv.config();

const connectToDB = async (uri: string) => {
  try {
    await mongoose.connect(uri, {});
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error(`You have a error: ${error.message}`);
    process.exit(1);
  }
};
const disconnectToDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    logger.info("MongoDB disconnected and droped");
  } catch (error) {
    logger.error(`You have a error: ${error.message}`);
    process.exit(1);
  }
};

export { connectToDB, disconnectToDB };
