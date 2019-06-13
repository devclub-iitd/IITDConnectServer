import mongoose, { Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import { isEmail } from "validator";

const userSchema = new mongoose.Schema(
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
          type: Schema.Types.ObjectId,
          ref: "Body"
        }
      ]
    },
    subscribedEvents: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Event"
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
          type: Schema.Types.ObjectId,
          ref: "Event"
        }
      ]
    }
  },
  { timestamps: true }
);

userSchema.plugin(mongooseUniqueValidator, { message: "Is Already Taken." });

const User = mongoose.model("User", userSchema);

export default User;
