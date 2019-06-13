import mongoose, { Schema } from "mongoose";

const bodySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  about: {
    type: String
  },
  dept: {
    type: String,
    uppercase: true,
    //* More To Be Added
    enum: ["CSE", "EE"]
  },
  events: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event"
      }
    ]
  }
});

const Body = mongoose.model("Body", bodySchema);

export default Body;
