import { Request, Response, Router } from "express";
import readXlsController from "../controllers/readerController";
import saveOzMapController from "../controllers/saveOzMapController";

export const router = Router();

// Read and save tables on mongoDB
router.post("/read-xls/boxes", (req: Request, res: Response) => {
  readXlsController.boxes(res);
});
router.post("/read-xls/splitters", (req: Request, res: Response) => {
  readXlsController.splitters(res);
});
router.post("/read-xls/users", (req: Request, res: Response) => {
  readXlsController.clients(res);
});

// Save on OzMap
router.post("/save/boxes", (req: Request, res: Response) => {
  saveOzMapController.boxes(res);
});
router.post("/save/splitters", (req: Request, res: Response) => {
  saveOzMapController.splitters(res);
});
