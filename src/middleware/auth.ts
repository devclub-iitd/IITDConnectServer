import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

const publicKey = fs.readFileSync(path.resolve(__dirname, './public.pem')); // Public Key path

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.split(' ')[1]
    ) {
      throw jwt.JsonWebTokenError;
    }

    const token = req.headers.authorization.split(' ')[1];

    const decoded: any = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    });

    // all went well, proceed;
    req.payload = decoded.user;

    return next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Not Authorized as not logged in...',
    });
  }
};

export default auth;