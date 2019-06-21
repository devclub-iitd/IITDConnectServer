import mongoose, { Schema, model, Model, Document } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { isEmail } from "validator";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  privilege: string;
  subscribedBodies: mongoose.Types.ObjectId[];
  // subscribedEvents: mongoose.Types.ObjectId[];
  canCreate: boolean;
  createdEvents: mongoose.Types.ObjectId[];
  staredEvents: mongoose.Types.ObjectId[];
  // star: (id: string) => null;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    // Add Regex Check For iitd email id
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Invalid Email"],
      lowercase: true
    },
    emailValidated: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    privilege: {
      type: String,
      lowercase: true,
      enum: ["admin", "organizer", "participant"],
      required: true
    },
    subscribedBodies: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Body"
        }
      ]
    },
    // subscribedEvents: {
    //   type: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Event"
    //     }
    //   ]
    // },
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

userSchema.plugin(mongooseUniqueValidator, { message: "Is Already Taken." });

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

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;
