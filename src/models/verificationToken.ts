import mongoose, { Schema, model, Model, Document } from "mongoose";

interface IVerificationToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
}

const verificationTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

const VerificationToken: Model<IVerificationToken> = model<IVerificationToken>(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
