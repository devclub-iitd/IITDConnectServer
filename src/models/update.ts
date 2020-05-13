import {Schema, model, Model, Document} from 'mongoose';

interface UpdateImpl extends Document {
  body: string;
  title: string;
  // event: mongoose.Types.ObjectId;
}

const updateSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    // event: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Event"
    // }
  },
  {timestamps: true}
);

const Update: Model<UpdateImpl> = model<UpdateImpl>('Update', updateSchema);

export default Update;
