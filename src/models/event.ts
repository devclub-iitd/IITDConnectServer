import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';

export interface EventImpl extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  about: string;
  body: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  participants: mongoose.Types.ObjectId[];
  venue: string;
  imageLink: string;
  updates: mongoose.Types.ObjectId[];
  topicName: string;
  // staredCount: number;
  official_inti_event: boolean;
  color: string;
  eventId: string;
  private: boolean;
}

const eventSchema = new Schema(
  {
    name: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    about: {
      type: String,
    },
    body: {
      type: Schema.Types.ObjectId,
      ref: 'Body',
    },
    venue: {
      type: String,
      required: true,
    },
    imageLink: {
      type: String,
    },
    startDate: {
      type: Date,
      // required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      // required: true
    },
    participants: {
      type: [{type: Schema.Types.ObjectId, ref: 'User'}],
    },
    // updates: {
    //   type: [
    //     {
    //       time: Date.now(),
    //       message: String
    //     }
    //   ]
    // }
    updates: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Update',
        },
      ],
    },
    topicName: String,
    // staredCount: {
    //   type: Number,
    //   default: 0
    // }
    official_inti_event: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'blue',
    },
    eventId: {
      type: String,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {timestamps: true}
);

// eventSchema.methods.eventJSOn = function() {
//   return {
//     name: this.name,
//     about: this.about,
//     body: this.body
//   };
// };

// eventSchema.methods.updateStaredCount = async function() {
//   const count = await User.count({
//     staredEvents: { $in: [this._id] }
//   });
//   this.staredCount = count;
// };

const Event: Model<EventImpl> = model<EventImpl>('Event', eventSchema);

export default Event;
