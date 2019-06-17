import mongoose, { Schema, model, Model, Document } from "mongoose";

interface IEvent extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  about: string;
  body: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  venue: string;
  imageLink: string;
  updates: mongoose.Types.ObjectId[];
}

const eventSchema = new Schema(
  {
    name: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    about: {
      type: String
    },
    body: {
      type: Schema.Types.ObjectId,
      ref: "Body"
    },
    venue: {
      type: String,
      required: true
    },
    imageLink: {
      type: String
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true
    },
    participants: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }]
    },
    updates: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Update"
        }
      ]
    }
  },
  { timestamps: true }
);

const Event: Model<IEvent> = model<IEvent>("Event", eventSchema);

export default Event;
