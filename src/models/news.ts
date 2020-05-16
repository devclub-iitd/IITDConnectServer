/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import {Schema, model, Model, Document} from 'mongoose';

export interface NewsImpl extends Document {
  sourceName: string;
  sourceUrl: string;
  createdBy: mongoose.Types.ObjectId;
  author: string;
  title: string;
  description: string;
  imgUrl: string;
  publDate: Date;
  content: string;
  clicks: number;
  reports: Array<object>;
}

const reportSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  reporter: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: false,
  },
});
const newsSchema = new Schema({
  sourceName: {
    type: String,
  },
  sourceUrl: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    trim: true,
  },
  publDate: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
  },
  clicks: {
    type: Number,
    default: 0,
    required: false,
  },
  reports: [reportSchema],
});

const News: Model<NewsImpl> = model<NewsImpl>('News', newsSchema);

export default News;
