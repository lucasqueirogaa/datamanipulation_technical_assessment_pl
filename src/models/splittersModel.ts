import { Schema, model } from "mongoose";
import { ISplitters } from "../types/Splitters";

const schema = new Schema<ISplitters>(
  {
    project: {
      type: String,
      required: true,
    },
    isDrop: {
      type: Boolean,
      required: true,
    },
    parent: {
      type: String,
      required: true,
    },
    splitterType: {
      type: String,
      required: true,
    },
    ratio: {
      type: Object,
      required: true,
      properties: {
        input: {
          type: Number,
          required: true,
        },
        output: {
          type: Number,
          required: true,
        },
      },
    },
    implanted: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const SplittersModel = model<ISplitters>("Splitters", schema);

export default SplittersModel;
