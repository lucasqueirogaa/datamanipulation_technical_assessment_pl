import { Response } from "express";
import axios from "axios";

import BoxesModel from "../models/boxesModel";
import { IBoxes } from "../types/Boxes";

import logger from "../log/logger";

const saveOzMapController = {
  boxes: async (res: Response) => {
    const boxes: IBoxes[] = await BoxesModel.find({});
    const response = [];

    if (boxes.length < 1) {
      return res.status(400).json({ message: "You need to have boxes on DB" });
    }

    const axiosRequests = boxes.map(async (box) => {
      try {
        const res = await axios.post(
          "https://data-manipulation-6.ozmap.com.br:9994/api/v2/boxes",
          {
            name: box.name,
            lat: box.lat,
            lng: box.lng,
            boxType: box.boxType,
            implanted: true,
            project: box.project,
            hierarchyLevel: box.hierarchyLevel,
            coords: null,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: process.env.AUTHORIZATION,
            },
            timeout: 2000,
          }
        );

        logger.info(`Request succeeded for box: ${box.name || res.data.name}`);
        response.push(
          `Request succeeded for box: ${box.name || res.data.name}`
        );
      } catch (error) {
        logger.error(
          `Request failed for box: ${box.name || "No box name"}`,
          error.response.data
        );
        response.push(
          `Request failed for box: ${box.name || "No box name"}, error: ${
            error.response.data
          }`
        );
      }
    });

    try {
      const BATCH_SIZE = 10;

      for (let i = 0; i < axiosRequests.length; i += BATCH_SIZE) {
        const batch = axiosRequests.slice(i, i + BATCH_SIZE);
        await Promise.all(batch);
      }

      res
        .status(200)
        .json({ message: "Success with return", response: response });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
};

export default saveOzMapController;
