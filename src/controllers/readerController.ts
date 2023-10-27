import { Response } from "express";
import { ObjectId } from "mongodb";
import * as path from "path";
import xlsx from "xlsx";

import BoxesModel from "../models/boxesModel";
import { IBoxesSheets } from "../types/BoxesType";
import logger from "../log/logger";

const filePath = path.resolve(__dirname, "../../files/data.xls");

const readXlsController = {
  boxes: async (res: Response) => {
    try {
      const file = xlsx.readFile(filePath);
      const sheet = file.Sheets["Boxes"];
      const data: IBoxesSheets[] = xlsx.utils.sheet_to_json(sheet);

      if (!data) {
        res.status(400).json({ message: "Error with file" });
      }

      const boxesArray = data.map((obj) => {
        return {
          ...obj,
          _id: new ObjectId(),
          project: process.env.PROJECT,
          draft: false,
          implanted: true,
          certified: false,
          hierarchyLevel: obj.Level || obj.Type === "CE" ? 3 : 2,
          template:
            obj.Type === "CE"
              ? "589de1d126324a2564a6c4d0"
              : "5da6146f493d9c00066653f7",
          boxType:
            obj.Type === "CE"
              ? "589ddcf07dfe452f10d7c274"
              : "589ddcf07dfe452f10d7c275",
          name: obj.Name || "",
          coords: [],
          lat: obj.Latitude || 0,
          lng: obj.Longitude || 0,
        };
      });
      const response = await BoxesModel.insertMany(boxesArray);

      res.status(200).json({ message: "Sucess with return", Boxes: response });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong" });
    }
  },
};

export default readXlsController;
