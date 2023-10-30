import { Response } from "express";
import axios from "axios";

import BoxesModel from "../models/boxesModel";
import { IBoxes } from "../types/Boxes";

import logger from "../log/logger";

const saveOzMapController = {
  boxes: async (res: Response) => {
    const boxes: IBoxes[] = await BoxesModel.find({});
    const axiosInstance = axios.create({
      baseURL: "https://data-manipulation-6.ozmap.com.br:9994/api/v2/",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: process.env.AUTHORIZATION,
      },
    });

    if (boxes.length < 1) {
      return res.status(400).json({ message: "You need to have boxes on DB" });
    }

    const sortedArray = boxes.sort((a, b) => {
      if (a.name === "" && b.name !== "") {
        return 1;
      } else if (a.name !== "" && b.name === "") {
        return -1;
      }
      return 0;
    });

    const axiosRequests = sortedArray.map(async (box) => {
      try {
        const res = await axiosInstance.post("boxes", {
          name: box.name,
          lat: box.lat,
          lng: box.lng,
          boxType: box.boxType,
          implanted: true,
          project: box.project,
          hierarchyLevel: box.hierarchyLevel,
          coords: null,
        });

        logger.info(`Request succeeded for box: ${box.name || res.data.name}`);
      } catch (error) {
        logger.error(
          `Request failed for box: ${box.name}, Error message: ${error.response.data}`
        );
      }
    });

    try {
      await Promise.all(axiosRequests);

      res.status(200).json({ message: "Boxes send with success" });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
};

export default saveOzMapController;
