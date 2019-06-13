import mongoose, { Schema } from "mongoose";

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
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
