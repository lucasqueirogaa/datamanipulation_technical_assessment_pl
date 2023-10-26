import { server } from "./api/index";
import { connectToDB } from "./config/db";
import dotenv from "dotenv";
dotenv.config();

connectToDB();
const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Listening in port: ${port}`);
});
