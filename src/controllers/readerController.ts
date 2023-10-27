import { Response } from "express";
import { ObjectId } from "mongodb";
import * as path from "path";
import xlsx from "xlsx";

import BoxesModel from "../models/boxesModel";
import { IBoxesSheets } from "../types/Boxes";
import logger from "../log/logger";
import { ISplittersSheets } from "../types/Splitters";
import axios from "axios";

const filePath = path.resolve(__dirname, "../../files/data.xls");

const readXlsController = {
  boxes: async (res: Response) => {
    let boxesTypes = [];

    const options = {
      method: "GET",
      url: "https://data-manipulation-6.ozmap.com.br:9994/api/v2/box-types",
      headers: {
        Accept: "application/json",
        Authorization: process.env.AUTHORIZATION,
      },
    };

    try {
      const { data } = await axios.request(options);
      boxesTypes = data.rows;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }

    try {
      const file = xlsx.readFile(filePath);
      const sheet = file.Sheets["Boxes"];
      const data: IBoxesSheets[] = xlsx.utils.sheet_to_json(sheet);

      if (!data) {
        return res.status(400).json({ message: "Error with file" });
      }

      const boxesArray = data.map((obj) => {
        const boxType = (type: String) => {
          const returnType = boxesTypes.find((obj) => {
            return obj.code === type;
          });
          return returnType.id;
        };

        return {
          _id: new ObjectId(),
          name: obj.Name || "",
          lat: obj.Latitude || 0,
          lng: obj.Longitude || 0,
          boxType: boxType(obj.Type),
          implanted: true,
          project: process.env.PROJECT,
          hierarchyLevel: obj.Level || obj.Type === "CE" ? 3 : 2,
          coords: [],
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
