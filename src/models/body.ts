import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';

export interface BodyImpl extends Document {
  name: string;
  about: string;
  caption: string;
  events: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  superAdmin: mongoose.Types.ObjectId;
  imageUrl: string;
  links: object;
  typeOfBody: number;
  members: Array<object>;
  hangoutInfo: object;
  topicName: string;
}
export interface BodyMemberImpl extends Document {
  userId: object;
  por: string;
  imgUrl: string;
  link: object;
}

const linksSchema = new Schema({
  webUrl: {
    type: String,
    trim: true,
  },
  instaUrl: {
    type: String,
    trim: true,
  },
  fbUrl: {
    type: String,
    trim: true,
  },
  linkedinUrl: {
    type: String,
    trim: true,
  },
});
const memberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  por: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    trim: true,
  },
  link: linksSchema,
});
const hangoutSchema = new Schema({
  contactNumber: {
    type: Number,
  },
  webUrl: {
    type: String,
    trim: true,
  },
  gmapsUrl: {
    type: String,
    trim: true,
  },
});
const bodySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    about: {
      type: String,
    },
    caption: {type: String},
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
    imageUrl: {
      type: String,
      trim: true,
    },
    links: linksSchema,
    typeOfBody: {
      type: Number,
      min: 0,
      max: 2, // 0-Hostel , 1-boards&clubs , 2-Hangout Places
      required: true,
    },
    topicName: {
      type: String,
      trim: true,
    },
    members: [memberSchema],
    hangoutInfo: hangoutSchema,
  },
  {timestamps: true}
);

const Body: Model<BodyImpl> = model<BodyImpl>('Body', bodySchema);
const BodyMember: Model<BodyMemberImpl> = model<BodyMemberImpl>(
  'BodyMember',
  memberSchema
);
export {Body, BodyMember};
