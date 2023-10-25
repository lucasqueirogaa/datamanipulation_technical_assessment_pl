import { Request, Response, Router } from "express";

export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, world" });
});
