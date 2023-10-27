import dotenv from "dotenv";

import { server } from "./api/index";
import { connectToDB } from "./config/db";
import logger from "./log/logger";

dotenv.config();

connectToDB();
const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`Listening on port: ${port}`);
});
