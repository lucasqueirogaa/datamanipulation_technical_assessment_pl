import { Schema, model } from "mongoose";
import { IClients } from "../types/Clients";

const schema = new Schema<IClients>(
  {
    address: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    box: {
      type: String,
    },
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
    force: {
      type: Boolean,
      required: true,
    },
    auto_connect: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ClientsModel = model<IClients>("Clients", schema);

export default ClientsModel;
