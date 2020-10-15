/* eslint-disable @typescript-eslint/no-unused-vars */
import {Request} from 'express';

declare global {
  namespace Express {
    interface Request {
      payload: {
        id: any;
        email: string;
      };
    }
  }
  interface Error {
    status?: number;
  }
}
