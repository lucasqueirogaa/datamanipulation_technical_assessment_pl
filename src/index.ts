import dotenv from "dotenv";

import { server } from "./api/index";
import { connectToDB } from "./config/db";
import logger from "./log/logger";

dotenv.config();

const uri = process.env.DB_URI;
const port = process.env.PORT || 3001;

connectToDB(uri);
server.listen(port, () => {
  logger.info(`Listening on port: ${port}`);
});
