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

module.exports = auth;

// import {Request} from 'express';
// import * as jwt from 'express-jwt';
// import {JWT_SECRET} from '../utils/secrets';

// const getTokenFromHeader = (req: Request): string | null => {
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.split(' ')[0] === 'Bearer'
//   ) {
//     // eslint-disable-next-line no-console
//     // console.log(req.headers.authorization.split(" ")[1]);
//     return req.headers.authorization.split(' ')[1];
//   }
//   return null;
// };

// const auth = {
//   required: jwt({
//     secret: JWT_SECRET,
//     algorithms: ['sha1', 'RS256', 'HS256'],
//     getToken: getTokenFromHeader,
//     userProperty: 'payload',
//     // requestProperty: "payload"
//   }),
//   optional: jwt({
//     secret: JWT_SECRET,
//     algorithms: ['sha1', 'RS256', 'HS256'],
//     getToken: getTokenFromHeader,
//     credentialsRequired: false,
//     userProperty: 'payload',
//     // requestProperty: "payload"
//   }),
// };

// export default auth;
