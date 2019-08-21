/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import uuid from "uuid/v5";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import {
  JWT_SECRET,
  FACEBOOK_CLIENTID,
  FACEBOOK_SECRET,
  GOOGLE_CLIENT_ID
} from "../utils/secrets";
import User from "../models/user";
import { createError, createResponse } from "../utils/helpers";

//TODO: Configire A Real SMTP Server
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "benjamin.kertzmann75@ethereal.email",
    pass: "Wh8YJTbFNvn67bknMr"
  }
});

//! Receive The Code From The Frontend

export const addUserInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, department, entryNumber } = req.body;
  const user = await User.findOne({
    $or: [{ iitdEmail: email }, { entryNumber: entryNumber }]
  });
  if (user) {
    throw createError(
      401,
      "Invalid Details",
      "Email or Entry Number Already In Use"
    );
  }
  const hash = uuid(email, uuid.DNS);
  User.findByIdAndUpdate(
    req.payload.id,
    {
      iitdEmail: email,
      department: department,
      entryNumber: entryNumber,
      hash: hash
    },
    { new: true }
  )
    .then(user => {
      if (!user) {
        throw createError(401, "Unauthorized", "Invalid Information");
      }
      //! Send a Confirmation Email
      const link = `http://${req.get("host")}/user/verify/${hash}`;
      return transporter.sendMail({
        from: '"DevClub 👻" <dev@example.com>', // sender address
        to: `${user.iitdEmail}`, // list of receivers
        subject: "Confirm Your Email Address", // Subject line
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>"
      });
    })
    .then(() => {
      return res
        .status(200)
        .json({ message: "We Have Sent An Email For Confirmation" });
    })
    .catch(err => next(err));
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hash: string = req.params.hash;
  User.findOneAndUpdate({ hash: hash }, { emailValidated: true }, { new: true })
    .then(user => {
      if (!user) {
        return null;
      }
      return res.json({ message: "Email Verified Successfully" });
    })
    .catch(err => next(err));
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .then(user => {
      if (user === null) {
        throw createError(401, "Unauthorized", "No Such User Found");
      }
      const respData = {
        user: {
          name: user.name
        }
      };
      return res.send(createResponse("User Found", respData));
    })
    .catch(e => {
      next(e);
    });
};

export const googleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.code;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  client
    .verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      const payload = ticket.getPayload();
      let userId: string;
      if (typeof payload === "undefined") {
        throw createError(
          400,
          "Invalid Login Credentials",
          "The User Credentials Provided Were Invalid"
        );
      }
      userId = payload["sub"];
      return Promise.all([
        User.findOne({
          googleID: userId
        }),
        userId
      ]);
    })
    .then(([user, userId]) => {
      if (user === null) {
        const newUser = new User({
          googleID: userId
        });
        return newUser.save();
      }
      return user;
    })
    .then(createdUser => {
      const payload = {
        id: createdUser._id
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d"
      });
      const respData = {
        token
      };
      res.send(createResponse("Login Successful", respData));
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

export const facebookLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code: string = req.body.code;
  // var options = {
  //   method: "GET",
  //   url: "https://graph.facebook.com/v3.3/oauth/access_token",
  //   qs: {
  //     code: `${code}`,
  //     client_id: `${FACEBOOK_CLIENTID}`,
  //     client_secret: `${FACEBOOK_SECRET}`,
  //     redirect_uri: "https://www.facebook.com/connect/login_success.html"
  //   },
  //   headers: {
  //     "cache-control": "no-cache",
  //     Connection: "keep-alive",
  //     "accept-encoding": "gzip, deflate",
  //     cookie:
  //       "fr=1ku81bPaFPh4R72zk..BdEcFJ.FY.AAA.0.0.BdEcPd.AWXWwKG9; sb=ScERXSwW8fJ7CseWB-7kr2O9",
  //     Host: "graph.facebook.com",
  //     "Cache-Control": "no-cache",
  //     Accept: "*/*"
  //   }
  // };
  // rp(options)
  //   .then(r => {
  //     let resp = JSON.parse(r);
  //     let options = {
  //       method: "GET",
  //       url: "https://graph.facebook.com/me",
  //       qs: {
  //         access_token: resp.access_token,
  //         fields: "id,name"
  //       }
  //     };
  //     return rp(options);
  //   })
  let options = {
    method: "GET",
    url: "https://graph.facebook.com/me",
    qs: {
      access_token: code,
      fields: "id,name"
    }
  };
  rp(options)
    .then(response => {
      let resp = JSON.parse(response);
      return Promise.all([User.findOne({ facebookID: resp.id }), resp]);
    })
    .then(([user, details]) => {
      if (!user) {
        const newUser = new User({
          facebookID: details.id,
          name: details.name
        });
        return newUser.save();
      }
      return user;
    })
    .then(createdUser => {
      console.log(createdUser.name);
      const payload = {
        id: createdUser._id
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d"
      });
      console.log(token);
      const respData = {
        token
      };
      res.send(createResponse("Login Successful", respData));
    })
    .catch(e => {
      next(e);
    });
};
