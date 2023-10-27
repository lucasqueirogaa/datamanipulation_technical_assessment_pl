import express from "express";
import { router } from "./router";

const server = express();

server.use(express.static("public"));
server.use(express.json());

server.use(router);

export { server };
