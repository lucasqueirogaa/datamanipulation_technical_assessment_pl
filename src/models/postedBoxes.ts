import { Schema, model } from "mongoose";
import { IPostedBoxes } from "../types/PostedBoxes";

const schema = new Schema<IPostedBoxes>(
  {
    name: {
      type: String,
    },
    id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const PostedBoxesModel = model<IPostedBoxes>("PostedBoxes", schema);

export default PostedBoxesModel;
