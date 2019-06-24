import mongoose, { Schema, model, Model, Document } from "mongoose";

interface UpdateImpl extends Document {
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

const Update: Model<UpdateImpl> = model<UpdateImpl>("Update", updateSchema);

export default Update;
