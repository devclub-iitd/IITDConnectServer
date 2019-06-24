/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";
import axios from "axios";
// import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import uuid from "uuid/v5";
import nodemailer from "nodemailer";
import {
  JWT_SECRET,
  FACEBOOK_CLIENTID,
  FACEBOOK_SECRET
} from "../utils/secrets";
import User from "../models/user";
import { createError, createResponse } from "../utils/helpers";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "benjamin.kertzmann75@ethereal.email",
    pass: "Wh8YJTbFNvn67bknMr"
  }
});

//! Receive The Code From The Frontend
export const faceBookLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const codeFromFacebook = req.body.code;
  //!  redirect_uri:- This argument is required and must be the same as the original request_uri that you used when starting the OAuth login process.
  axios
    .get("https://graph.facebook.com/v3.3/oauth/access_token?", {
      params: {
        client_id: FACEBOOK_CLIENTID,
        redirect_uri: "",
        client_secret: FACEBOOK_SECRET,
        code: codeFromFacebook
      }
    })
    .then(response => {
      const acessToken = response.data["access_token"];
      if (acessToken === "") {
        throw createError(
          401,
          "Unauthorized",
          `Invalid Code : ${codeFromFacebook}`
        );
      }
      return acessToken;
    })
    .then(acessToken => {
      return axios.get("https://graph.facebook.com/me", {
        params: {
          access_token: acessToken,
          fields: "email,name"
        }
      });
    })
    .then(response => {
      const userDetails = response.data;
      return Promise.all([
        User.findOne({ email: userDetails["emails"] }),
        userDetails
      ]);
    })
    .then(([user, userDetails]) => {
      if (!user) {
        const newUser = new User({
          email: userDetails["email"],
          name: userDetails["name"]
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
    .catch(err => next(err));
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const codeFromGoogle: string = req.body.code;
  // const client = new OAuth2Client(GOOGLE_CLIENT_ID);
  // const ticket = await client.verifyIdToken({
  //   idToken: tokenFromGoogle,
  //   audience: GOOGLE_CLIENT_ID
  // });
  // const userId = ticket.getUserId();
  const oauth2Client = new google.auth.OAuth2({
    clientId: "",
    clientSecret: "",
    redirectUri: ""
  });
  //TODO: Add Error Handling
  const { tokens } = await oauth2Client.getToken(codeFromGoogle);
  oauth2Client.setCredentials(tokens);
  const people = google.people({
    version: "v1",
    auth: oauth2Client
  });
  const response = await people.people.get({
    resourceName: "people/me",
    personFields: "emailAddresses,names"
  });
  let email = "";
  let name = "";
  if (response.data["emailAddresses"] !== undefined) {
    email = response.data["emailAddresses"][0].value as string;
  }
  if (response.data["names"] !== undefined) {
    name = response.data["names"][0].displayName as string;
  }
  User.findOne({
    email: email
  })
    .then(user => {
      if (!user) {
        const newUser = new User({ email, name });
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
    .catch(err => next(err));
};

export const addUserInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array());
    throw createError(400, "Invalid Information", "Information is not Valid ");
  }
  const { email, department, entryNumber } = req.body;
  const user = await User.findOne({
    $or: [{ iitdEmail: email }, { entryNumber: entryNumber }]
  });
  if (user) {
    //* Entry Number Already In Use
    return res.status(420).send("Entry Number or Email Is Already In Use");
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
        throw createError(401, "Unauthorized", "Information/JWT is Invalid");
      }
      //! Send a Confirmation Email
      // const link="http://"+req.get('host')+"/verify?id="+;
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
    .then(_info => {
      return res
        .status(200)
        .json({ message: "We Have Sent An Email For Confirmation" });
    })
    .catch(err => next(err));
  return null;
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

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (user === null) {
    //! Invalid UserId
    return res.status(404).json({
      error: "User Not Found"
    });
  }
  return res.status(200).json({
    name: user.name
  });
};
