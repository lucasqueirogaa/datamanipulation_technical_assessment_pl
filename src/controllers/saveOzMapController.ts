import { Response } from "express";
import axios from "axios";

import BoxesModel from "../models/boxesModel";
import { IBoxes } from "../types/Boxes";

import logger from "../log/logger";
import PostedBoxesModel from "../models/postedBoxes";

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

    const emptyNameItems = boxes.filter((box) => box.name === "");
    const normalItems = boxes.filter((box) => box.name !== "");

    const axiosRequests = normalItems.map(async (box) => {
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

        logger.info(`Request succeeded for box: ${box.name}`);
        await PostedBoxesModel.create({
          name: res.data.name,
          id: res.data.id,
        });
      } catch (error) {
        logger.error(
          `Request failed for box: ${box.name}, Error message: ${error.response.data}`
        );
      }
    });

    try {
      res.status(200).json({ message: "Boxes send with success" });

      await Promise.allSettled(axiosRequests);

      const axiosRequestsEmptyName = emptyNameItems.map(async (box) => {
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

          logger.info(`Request succeeded for box: ${res.data.name}`);
          await PostedBoxesModel.create({
            name: res.data.name,
            id: res.data.id,
          });
        } catch (error) {
          logger.error(
            `Request failed for box: ${box.name}, Error message: ${error.response.data}`
          );
        }
      });

      await Promise.allSettled(axiosRequestsEmptyName);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
};

export default saveOzMapController;
