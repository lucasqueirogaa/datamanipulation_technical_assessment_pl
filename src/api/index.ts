import express from "express";
// import cors from "cors";
import { router } from "./router";

const server = express();

server.use(express.static("public"));
// server.use(cors());
server.use(express.json());

server.use(router);

export { server };
