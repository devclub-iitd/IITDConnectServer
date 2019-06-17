import mongoose, { Schema, model, Model, Document } from "mongoose";

interface IUpdate extends Document {
  message: string;
  event: mongoose.Types.ObjectId;
}

const updateSchema = new Schema(
  {
    message: {
      type: String,
      required: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  },
  { timestamps: true }
);

const Update: Model<IUpdate> = model<IUpdate>("Update", updateSchema);

export default Update;
