import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      payload: {
        id: any;
      };
    }
  }
}

// export class CustomError extends Error {
//   status: number;
// }
