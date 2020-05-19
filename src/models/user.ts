import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';
import {isEmail} from 'validator';

export interface UserImpl extends Document {
  name: string;
  password: string;
  privilege: string;
  subscribedBodies: mongoose.Types.ObjectId[];
  canCreate: boolean;
  createdEvents: mongoose.Types.ObjectId[];
  staredEvents: mongoose.Types.ObjectId[];
  iitdEmail: string;
  emailValidated: boolean;
  facebookID: string;
  googleID: string;
  entryNumber: string;
  department: string;
  fcmRegistrationToken: string;
  adminOf: mongoose.Types.ObjectId[];
  email: string;
  superSuperAdmin: boolean;
  superAdminOf: mongoose.Types.ObjectId[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  reminders: Object;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    facebookID: String,
    googleID: String,
    department: {
      type: String,
      uppercase: true,
      //* More To Be Added
      enum: ['CSE', 'EE'],
    },
    entryNumber: String,
    emailValidated: {
      type: Boolean,
      default: false,
    },
    superSuperAdmin: {
      type: Boolean,
      default: false,
    },
    iitdEmail: {
      type: String,
      lowercase: true,
      validate: [isEmail, 'Invalid Email'],
    },
    fcmRegistrationToken: String,
    hash: {
      type: String,
    },
    privilege: {
      type: String,
      lowercase: true,
      enum: ['admin', 'organizer', 'participant'],
    },
    subscribedBodies: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Body',
        },
      ],
    },
    canCreate: {
      type: Boolean,
      default: false,
    },
    createdEvents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
        },
      ],
    },
    staredEvents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Event',
        },
      ],
    },
    adminOf: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Body',
        },
      ],
    },
    superAdminOf: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Body',
        },
      ],
    },
  },
  {timestamps: true}
);

// virtual schema field for populating the reminder
userSchema.virtual('reminders', {
  ref: 'Reminder',
  localField: '_id',
  foreignField: 'createdBy',
});

// userSchema.methods.star = function(id: string) {
//   if (this.staredEvents.indexOf(id) === -1) {
//     this.staredEvents.push(id);
//   }
//   return this.save();
// };

// userSchema.methods.unstar = function(id: string) {
//   this.staredEvents.remove(id);
//   return this.save();
// };

// userSchema.methods.isStarred = function(id: string) {
//   return this.staredEvents.indexOf(id) !== -1;
// };

// userSchema.methods.subscribeToBody = function(id: string) {
//   if (this.subscribedBodies.indexOf(id) === -1) {
//     this.subscribedBodies.push(id);
//   }
//   return this.save();
// };

//TODO: Add The Method To Unsubscribe To A Body

const User: Model<UserImpl> = model<UserImpl>('User', userSchema);

export default User;
