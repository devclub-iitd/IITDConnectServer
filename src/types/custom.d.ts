/* eslint-disable @typescript-eslint/no-unused-vars */
import {Request} from 'express';
import * as mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      payload: mongoose.Types.ObjectId;
    }
  }
  interface Error {
    status?: number;
  }
}
