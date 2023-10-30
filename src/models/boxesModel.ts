import { Schema, model } from "mongoose";
import { IBoxes } from "../types/Boxes";

const schema = new Schema<IBoxes>(
  {
    name: {
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
    boxType: {
      type: String,
      required: true,
    },
    implanted: {
      type: Boolean,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    hierarchyLevel: {
      type: Number,
      required: true,
    },
    coords: Array<Number>,
  },
  { timestamps: true }
);

const BoxesModel = model<IBoxes>("Boxes", schema);

export default BoxesModel;
