import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';

export interface BodyImpl extends Document {
  name: string;
  about: string;
  dept: string;
  events: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  superAdmin: mongoose.Types.ObjectId;
}

const bodySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    dept: {
      type: String,
      uppercase: true,
      //* More To Be Added
      enum: ['CSE', 'EE', 'ME', 'CH', 'CE', 'BRCA'],
    },
    events: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Event',
        },
      ],
    },
    admins: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    superAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {timestamps: true}
);

const Body: Model<BodyImpl> = model<BodyImpl>('Body', bodySchema);

export default Body;
