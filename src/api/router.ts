import { Request, Response, Router } from "express";
import readXlsController from "../controllers/readerController";

export const router = Router();

// Read and save tables on mongoDB
router.post("/read-xls/boxes", (req: Request, res: Response) => {
  readXlsController.boxes(res);
});
