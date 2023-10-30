import { Schema, model } from "mongoose";
import { IClients } from "../types/Clients";

const schema = new Schema<IClients>(
  {
    address: {
      type: String,
      required: true,
    },
    box: {
      type: String,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
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
    status: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const ClientsModel = model<IClients>("Clients", schema);

export default ClientsModel;
