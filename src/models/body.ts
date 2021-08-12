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
  members: BodyMemberImpl[];
  hangoutInfo: object;
  roles: mongoose.Types.ObjectId[];
}
//Removed extends Document from BodyMemberImpl
export interface BodyMemberImpl {
  userId: mongoose.Types.ObjectId;
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
    ref: 'User',
  },
  por: {
    type: String,
    required: true,
    trim: true,
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
    members: [memberSchema],
    hangoutInfo: hangoutSchema,
    roles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
    },
  },
  {timestamps: true}
);

const Body: Model<BodyImpl> = model<BodyImpl>('Body', bodySchema);
const BodyMember: Model<BodyMemberImpl> = model<BodyMemberImpl>(
  'BodyMember',
  memberSchema
);
export {Body, BodyMember};
