import { server } from "./api/index";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Listening in port: ${port}`);
});
