import { Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

import BoxesModel from "../models/boxesModel";
import { IBoxes } from "../types/Boxes";

import logger from "../log/logger";
import PostedBoxesModel from "../models/postedBoxes";
import { ISplitters } from "../types/Splitters";
import SplittersModel from "../models/splittersModel";
import { IClients } from "../types/Clients";
import ClientsModel from "../models/clientsModel";

dotenv.config();

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
      res.status(200).json({ message: "Boxes sent successfully." });

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
    const boxes: ISplitters[] = await BoxesModel.find({});
    const splitters: ISplitters[] = await SplittersModel.find({});

    if (splitters.length < 1 || boxes.length < 1) {
      return res
        .status(400)
        .json({ message: "You need to have splitters on DB" });
    }

    const axiosRequests = splitters.map(async (splitter) => {
      const getParent = async (parent: string) => {
        const res = await PostedBoxesModel.findOne({ name: parent });

        if (res === null || res === undefined) return null;
        return res.id;
      };

      const parentId = splitter.parent
        ? await getParent(splitter.parent)
        : null;

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
          `Request failed for box: ${splitter.name} with parent: ${splitter.parent}, Error message: ${error.response.data}`
        );
      }
    });

    try {
      res.status(200).json({ message: "Splitters sent successfully." });

      await Promise.allSettled(axiosRequests);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
  clients: async (res: Response) => {
    const boxes: ISplitters[] = await BoxesModel.find({});
    const splitters: ISplitters[] = await SplittersModel.find({});
    const clients: IClients[] = await ClientsModel.find({});

    if (clients.length < 1 || splitters.length < 1 || boxes.length < 1) {
      return res
        .status(400)
        .json({ message: "You need to have clients on DB" });
    }

    const axiosRequests = clients.map(async (client) => {
      const getBoxId = async (box: string) => {
        const res = await PostedBoxesModel.findOne({ name: box });

        if (res === null || res === undefined) return null;
        return res.id;
      };

      const boxId = client.box ? await getBoxId(client.box) : null;

      try {
        await axiosInstance.post("properties", {
          address: client.address,
          project: process.env.PROJECT,
          box: boxId,
          lat: client.lat,
          lng: client.lng,
          force: true,
          auto_connect: true,
          client: {
            implanted: true,
            name: client.name,
            code: client.code,
            status: client.status,
          },
        });

        logger.info(
          `Request succeeded for Propertie: ${client.address} with client code: ${client.code}`
        );
      } catch (error) {
        console.log(error);
        logger.error(
          `Request failed for client: ${client.code}, Error message: ${error.response.data}`
        );
      }
    });

    try {
      res.status(200).json({ message: "Clients sent successfully." });

      await Promise.allSettled(axiosRequests);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong", error: error });
    }
  },
};

export default saveOzMapController;
