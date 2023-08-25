/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';

export interface LostItemImpl extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  description: string;
  imgUrl: string;
  place: string;
  visible: boolean;
  createdAt: Date;
  status: boolean; //if false then still not returned
}

const lostItemSchema = new Schema(
  {
    name: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
    },
    imgUrl: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
    },
    visible: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

const LostItem: Model<LostItemImpl> = model<LostItemImpl>(
  'LostItem',
  lostItemSchema
);

export default LostItem;
