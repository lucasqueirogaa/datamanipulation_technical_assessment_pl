import { Response } from "express";
import { ObjectId } from "mongodb";
import * as path from "path";
import axios from "axios";
import xlsx from "xlsx";

import BoxesModel from "../models/boxesModel";
import SplittersModel from "../models/splittersModel";
import { IBoxesSheets } from "../types/Boxes";
import { ISplittersSheets } from "../types/Splitters";

import logger from "../log/logger";
import { IClientsSheets } from "../types/Clients";
import ClientsModel from "../models/clientsModel";

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

      if (data.length < 1) {
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
  splitters: async (res: Response) => {
    let splittersTypes = [];

    const boxes = await BoxesModel.find({});

    if (boxes.length < 1) {
      return res.status(400).json({ message: "You need the boxes on DB" });
    }

    const options = {
      method: "GET",
      url: "https://data-manipulation-6.ozmap.com.br:9994/api/v2/splitter-types",
      headers: {
        Accept: "application/json",
        Authorization: process.env.AUTHORIZATION,
      },
    };

    try {
      const { data } = await axios.request(options);
      splittersTypes = data.rows;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }

    try {
      const file = xlsx.readFile(filePath);
      const sheet = file.Sheets["Splitters"];
      const data: ISplittersSheets[] = xlsx.utils.sheet_to_json(sheet);

      if (data.length < 1) {
        return res.status(400).json({ message: "Error with file" });
      }

      const splittersArray = data.map((obj) => {
        const splitterType = (type: String) => {
          const returnType = splittersTypes.find((obj) => {
            return obj.code === type;
          });
          return returnType.id;
        };

        return {
          implanted: obj.Implanted === "No" ? false : true,
          isDrop: obj["Allows client connection"] === "No" ? false : true,
          parent: obj.Box || "",
          project: process.env.PROJECT,
          name: obj.Name,
          splitterType: splitterType(obj.Type),
          ratio: {
            output: obj.Outputs,
            input: obj.Inputs,
          },
        };
      });
      const response = await SplittersModel.insertMany(splittersArray);

      res
        .status(200)
        .json({ message: "Sucess with return", Splitters: response });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong" });
    }
  },
  clients: async (res: Response) => {
    try {
      const file = xlsx.readFile(filePath);
      const sheet = file.Sheets["Clients"];
      const data: IClientsSheets[] = xlsx.utils.sheet_to_json(sheet);

      if (data.length < 1) {
        return res.status(400).json({ message: "Error with file" });
      }

      const options = {
        method: "GET",
        url: `https://randomuser.me/api/?results=${data.length}&nat=BR`,
      };

      const randomUsers = await axios.request(options);

      if (!randomUsers.data) {
        return res.status(400).json({ message: "Error with random users API" });
      }

      const userArray = data.map((obj, index) => {
        const currentRandomUser = randomUsers.data.results[index];

        return {
          address: `${currentRandomUser.location.street.name} ${currentRandomUser.location.street.number} ${currentRandomUser.location.postcode} ${currentRandomUser.location.city} ${currentRandomUser.location.state} ${currentRandomUser.location.country}`,
          project: process.env.PROJECT,
          box: obj.Box || "",
          lat: obj.Latitude || 0,
          lng: obj.Longitude || 0,
          force: true,
          auto_connect: true,
          username: currentRandomUser.login.username,
          email: currentRandomUser.email,
          name: `${currentRandomUser.name.first} ${currentRandomUser.name.last}`,
          code: `${(
            currentRandomUser.name.first +
            "." +
            currentRandomUser.name.last
          ).toLocaleLowerCase()}`,
        };
      });

      const response = await ClientsModel.insertMany(userArray);

      res.status(200).json({ message: "Sucess with return", Users: response });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: "Something get wrong" });
    }
  },
};

export default readXlsController;
