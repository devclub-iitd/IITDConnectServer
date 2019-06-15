import mongoose, { Schema, model, Model, Document } from "mongoose";

interface IBody extends Document {
  name: string;
  about: string;
  dept: string;
  events: mongoose.Types.ObjectId[];
}

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

const Body: Model<IBody> = model<IBody>("Body", bodySchema);

export default Body;
