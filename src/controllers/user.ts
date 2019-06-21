import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator/check";
import User from "../models/user";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  FACEBOOK_CLIENTID,
  FACEBOOK_SECRET
} from "../utils/secrets";
import axios from "axios";
// import { OAuth2Client } from "google-auth-library";
import { createError, createResponse } from "../utils/helpers";
// var id = crypto.randomBytes(20).toString('hex');

export const signUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, entryNumber } = req.body;
    let user = User.findOne({
      $or: [{ email: email }, { entryNumber: entryNumber }]
    });
    if (user) {
      return res.status(420).send("Username or Email Is Already In Use");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    //TODO: Add The Secret Key From Environment Variables
    return res.status(200).json({
      message: "Registration Successful"
    });
  } catch (error) {
    console.log(error);
    //TODO: Send The Error In A Proper Structure
    return res.status(500).send("Connection Issue");
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "invalid login details" }] });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "invalid login details" }] });
    }
    //TODO: Return The Jwt Token To The Frontend
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400 //? Is 1 Day Ok
    });
    return res.status(200).json({
      data: {
        token
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Connection Issue");
  }
};

//! Receive The Code From The Frontend
export const faceBookLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const codeFromFacebook = req.headers["facebook-code"];
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
      const access_token = response.data["access_token"];
      if (access_token === "") {
        throw createError(
          401,
          "Unauthorized",
          `Invalid Code : ${codeFromFacebook}`
        );
      }
      return access_token;
    })
    .then(access_token => {
      return axios.get("https://graph.facebook.com/me", {
        params: {
          access_token: access_token,
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
      const resp_data = {
        token
      };
      res.send(createResponse("Login Successful", resp_data));
    })
    .catch(err => next(err));
};

// export const googleLogin =
