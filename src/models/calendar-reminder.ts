import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';
export interface ReminderImpl extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
  venue: string;
}

const reminderSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
  },
});
const Reminder: Model<ReminderImpl> = model<ReminderImpl>(
  'Reminder',
  reminderSchema
);

export default Reminder;
