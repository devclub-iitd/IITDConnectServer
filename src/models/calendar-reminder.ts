import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';
export interface ReminderImpl extends Document {
  createdBy: mongoose.Types.ObjectId;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  venue: string;
  color: string;
  repeat: string;
  eventId: string;
  reminder: string;
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
  color: {
    type: String,
  },
  repeat: {
    type: String,
  },
  eventId: {
    type: String,
  },
  description: {
    type: String,
  },
  reminders: {
    type: String,
  },
});
const Reminder: Model<ReminderImpl> = model<ReminderImpl>(
  'Reminder',
  reminderSchema
);

export default Reminder;
