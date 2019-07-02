import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      payload: {
        id: any;
      };
    }
  }
  interface Error {
    status?: number;
  }
}
