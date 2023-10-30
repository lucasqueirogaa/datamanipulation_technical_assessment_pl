import { Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

import BoxesModel from "../models/boxesModel";
import { IBoxes } from "../types/Boxes";

import logger from "../log/logger";
import PostedBoxesModel from "../models/postedBoxes";
import { ISplitters } from "../types/Splitters";
import SplittersModel from "../models/splittersModel";

dotenv.config();

const testeSplitters = [
  {
    project: "65381629de424200206126b7",
    isDrop: false,
    parent: "CTO - 1",
    splitterType: "5da6106b493d9c00066653f4",
    ratio: {
      output: 2,
      input: 1,
    },
    implanted: true,
    name: "Splitter 1",
  },
  {
    project: "65381629de424200206126b7",
    isDrop: false,
    parent: "CTO - 2",
    splitterType: "5da6106b493d9c00066653f4",
    ratio: {
      output: 2,
      input: 1,
    },
    implanted: true,
    name: "",
  },
  {
    project: "65381629de424200206126b7",
    isDrop: false,
    parent: "Condominio 1",
    splitterType: "5da6106b493d9c00066653f4",
    ratio: {
      output: 2,
      input: 1,
    },
    implanted: true,
    name: "",
  },
  {
    project: "65381629de424200206126b7",
    isDrop: false,
    parent: "",
    splitterType: "5da6106b493d9c00066653f4",
    ratio: {
      output: 2,
      input: 1,
    },
    implanted: true,
    name: "",
  },
];

const axiosInstance = axios.create({
  baseURL: "https://data-manipulation-6.ozmap.com.br:9994/api/v2/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: process.env.AUTHORIZATION,
  },
});

const saveOzMapController = {
  boxes: async (res: Response) => {
    const boxes: IBoxes[] = await BoxesModel.find({});

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
  splitters: async (res: Response) => {
    const splitters: ISplitters[] = await SplittersModel.find({});

    if (splitters.length < 1) {
      return res
        .status(400)
        .json({ message: "You need to have splitters on DB" });
    }

    const axiosRequests = splitters.map(async (splitter) => {
      const getParent = async (parent: string) => {
        const res = await PostedBoxesModel.findOne({ name: parent });

        return res.id;
      };

      const parentId = await getParent(splitter.parent);

      try {
        const res = await axiosInstance.post("splitters", {
          implanted: splitter.implanted,
          isDrop: splitter.isDrop,
          parent: parentId,
          project: splitter.project,
          name: splitter.name || "",
          splitterType: splitter.splitterType,
          ratio: splitter.ratio,
        });

        logger.info(
          `Request succeeded for splitter: ${
            splitter.name || res.data.name
          } with parent: ${splitter.parent}`
        );
      } catch (error) {
        logger.error(
          `Request failed for box: ${splitter.name}, Error message: ${error.response.data}`
        );
      }
    });

    try {
      res.status(200).json({ message: "Splitters send with success" });

      await Promise.allSettled(axiosRequests);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
};

export default saveOzMapController;
