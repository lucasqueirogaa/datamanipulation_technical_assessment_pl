import { Schema, model } from "mongoose";
import { IBoxes } from "../types/BoxesType";

const schema = new Schema<IBoxes>(
  {
    project: {
      type: String,
      required: true,
    },
    draft: Boolean,
    implanted: {
      type: Boolean,
      required: true,
    },
    certified: Boolean,
    hierarchyLevel: {
      type: Number,
      required: true,
    },
    template: String,
    boxType: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    coords: Array<Number>,
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BoxesModel = model<IBoxes>("Boxes", schema);

export default BoxesModel;
