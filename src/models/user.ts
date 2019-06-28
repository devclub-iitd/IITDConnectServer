import mongoose, { Schema, model, Model, Document } from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";
import { isEmail } from "validator";

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
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String
    },
    facebookID: String,
    googleID: String,
    department: {
      type: String,
      uppercase: true,
      //* More To Be Added
      enum: ["CSE", "EE"]
    },
    entryNumber: String,
    emailValidated: {
      type: Boolean,
      default: false
    },
    iitdEmail: {
      type: String,
      lowercase: true,
      validate: [isEmail, "Invalid Email"]
    },
    hash: {
      type: String
    },
    privilege: {
      type: String,
      lowercase: true,
      enum: ["admin", "organizer", "participant"]
    },
    subscribedBodies: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Body"
        }
      ]
    },
    canCreate: {
      type: Boolean,
      default: false
    },
    createdEvents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event"
        }
      ]
    },
    staredEvents: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event"
        }
      ]
    }
  },
  { timestamps: true }
);

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

const User: Model<UserImpl> = model<UserImpl>("User", userSchema);

export default User;
