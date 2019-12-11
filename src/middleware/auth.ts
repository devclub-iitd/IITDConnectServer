import { Request } from "express";
import jwt from "express-jwt";
import { JWT_SECRET } from "../utils/secrets";

const getTokenFromHeader = (req: Request): string | null => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // eslint-disable-next-line no-console
    // console.log(req.headers.authorization.split(" ")[1]);
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    userProperty: "payload"
    // requestProperty: "payload"
  }),
  optional: jwt({
    secret: JWT_SECRET,
    getToken: getTokenFromHeader,
    credentialsRequired: false,
    userProperty: "payload"
    // requestProperty: "payload"
  })
};

export default auth;
