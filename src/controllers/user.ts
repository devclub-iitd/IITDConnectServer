/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";
import rp from "request-promise";
import bcrypt from "bcryptjs";
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
import Body, { BodyImpl } from "../models/body";
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
      return res.send(createResponse("User Found", user));
    })
    .catch(e => {
      next(e);
    });
};

// export const googleLogin = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // console.log(req.body.code);
//   let options = {
//     method: "POST",
//     url: "https://www.googleapis.com/oauth2/v4/token",
//     qs: {
//       code:
//         "4/qgFTlrAPQBsataxYY41mBofAbcEuUIkvHlWfkrVgMNFiyijGUiLO0ACbRQZ3ec3r0ebF70ujojyS22fu65ebFro",
//       grant_type: "authorization_code",
//       redirect_uri: "http://localhost:5000",
//       client_id:
//         "205021812271-v4hbhl4dp9qgoqkdfuldcrgnfpl1jc1r.apps.googleusercontent.com",
//       client_secret: "SdT4ARWJ1da6GtpcwHyiQWLo"
//     }
//   };
//   rp(options)
//     .then(r => {
//       let resp = JSON.parse(r);
//       console.log(resp);
//       return res.send("The Request Was Successful");
//     })
//     .catch(e => {
//       console.log(e);
//       return res.send("Error");
//     });
// };

// export const facebookLogin = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const code: string = req.body.code;
//   let newOptions = {
//     method: "GET",
//     url: "https://graph.facebook.com/v3.3/oauth/access_token",
//     qs: {
//       code: `${code}`,
//       client_id: "826437701076131",
//       client_secret: "380272230a23a7710876a11ede955d2c",
//       redirect_uri: "https://www.facebook.com/connect/login_success.html"
//     }
//   };
//   rp(newOptions)
//     .then(r => {
//       let resp = JSON.parse(r);
//       return resp;
//     })
//     .then(code => {
//       let options = {
//         method: "GET",
//         url: "https://graph.facebook.com/me",
//         qs: {
//           access_token: code.access_token,
//           fields: "id,name"
//         }
//       };
//       rp(options)
//         .then(response => {
//           let resp = JSON.parse(response);
//           return Promise.all([User.findOne({ facebookID: resp.id }), resp]);
//         })
//         .then(([user, details]) => {
//           if (!user) {
//             const newUser = new User({
//               facebookID: details.id,
//               name: details.name
//             });
//             return newUser.save();
//           }
//           return user;
//         })
//         .then(createdUser => {
//           console.log(createdUser.name);
//           const payload = {
//             id: createdUser._id
//           };
//           const token = jwt.sign(payload, JWT_SECRET, {
//             expiresIn: "7d"
//           });
//           console.log(token);
//           const respData = {
//             token
//           };
//           res.send(createResponse("Login Successful", respData));
//         })
//         .catch(e => {
//           next(e);
//         });
//     });
// };

// export const googleLogin = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // const token = req.body.code;
//   const token =
//     "ya29.Glt1B0VGL3joCk_CBFLMsufVXdjRBAm93iScL88fW5HxMNgQ17CgGoN__s7ZSxAoaaazZHpcEaMoqtLoA9alOpcCwuzjtLkM_upqa-oNsvTBTpfScxukMlatP2i6";
//   const client = new OAuth2Client(GOOGLE_CLIENT_ID);
//   client
//     .verifyIdToken({
//       idToken: token,
//       audience: GOOGLE_CLIENT_ID
//     })
//     .then(ticket => {
//       const payload = ticket.getPayload();
//       let userId: string;
//       if (typeof payload === "undefined") {
//         throw createError(
//           400,
//           "Invalid Login Credentials",
//           "The User Credentials Provided Were Invalid"
//         );
//       }
//       userId = payload["sub"];
//       return Promise.all([
//         User.findOne({
//           googleID: userId
//         }),
//         userId
//       ]);
//     })
//     .then(([user, userId]) => {
//       if (user === null) {
//         const newUser = new User({
//           googleID: userId
//         });
//         return newUser.save();
//       }
//       return user;
//     })
//     .then(createdUser => {
//       const payload = {
//         id: createdUser._id
//       };
//       const token = jwt.sign(payload, JWT_SECRET, {
//         expiresIn: "7d"
//       });
//       const respData = {
//         token
//       };
//       res.send(createResponse("Login Successful", respData));
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// };

export const postMakeSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clubId, userEmail } = req.body;
  return Promise.all([
    User.findOne({
      email: userEmail
    }),
    Body.findById(clubId)
  ])
    .then(([user, body]) => {
      if (body != null && user != null) {
        if ("5df25041d07fbd82cc6a73e9" == req.payload.id) {
          body.superAdmin = user._id;
          // user.adminOf.push(body.id), body.admins.push(user.id);
          return Promise.all([user.save(), body.save()]);
        } else {
          res.send(
            createError(
              404,
              "Authorization",
              "Not Authorized To Perform this Action"
            )
          );
        }
      } else {
        res.send(createError(404, "Invalid", "Invalid Club or User"));
      }
    })
    .then(() => {
      res.send("Successfully Created The SuperUser");
    });
};

export const postMakeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clubId, userEmail } = req.body;
  return Promise.all([
    User.findOne({
      email: userEmail
    }),
    Body.findById(clubId)
  ])
    .then(([user, body]) => {
      if (body != null && user != null) {
        if (body.superAdmin == req.payload.id) {
          user.adminOf.push(body.id), body.admins.push(user.id);
          return Promise.all([user.save(), body.save()]);
        } else {
          res.send(
            createError(
              404,
              "Authorization",
              "Not Authorized To Perform this Action"
            )
          );
        }
      } else {
        res.send(createError(404, "Invalid", "Invalid Club or User"));
      }
    })
    .then(() => {
      res.send("Successfully Created The Admin");
    });
};

export const getListOfAdmins = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clubId } = req.body;
  // return res.send(clubId);
  Body.findById(clubId)
    .populate("admins")
    .then(body => {
      console.log(body);
      if (body != null) {
        const admins = body.admins;
        return res.send(
          createResponse("Success", {
            admins: admins
          })
        );
      }
      return res.send(createError(404, "Invalid", "Invalid Club Id"));
    })
    .catch(err => {
      next(err);
    });
};

export const removeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const superUserId = req.payload.id;
  const { userEmail, clubId } = req.body.id;
  return Promise.all([
    User.findOne({ email: userEmail }),
    Body.findById(clubId)
  ])
    .then(([user, body]) => {
      if (body != null && user != null) {
        if (body.superAdmin == req.payload.id) {
          const indexOne = body.admins.indexOf(user.id);
          const indexTwo = user.adminOf.indexOf(body.id);
          if (indexOne != -1) {
            body.admins.splice(indexOne, 1);
          }
          if (indexTwo != -1) {
            user.adminOf.splice(indexTwo, 1);
          }
          return Promise.all([user.save(), body.save()]);
        } else {
          res.send(
            createError(
              404,
              "Authorization",
              "Not Authorized To Perform this Action"
            )
          );
        }
      } else {
        res.send(createError(404, "Invalid", "Invalid Club or User"));
      }
    })
    .then(() => {
      res.send("Successfully Deleted The Admin");
    });
};

export const signUp = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    console.log("Wrong");
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  // let user = User.findOne({ $or: [{ email: email }] });
  User.findOne({
    email: email
  }).then(user => {
    if (user != null) {
      console.log(user);
      console.log("Already");
      return res.status(420).send("Username or Email Is Already In Use");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    newUser
      .save()
      .then(() => {
        //TODO: Return The Jwt Token To The Frontend
        return res.json({
          message: "Registration Successful"
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(500).send("Connection Issue");
      });
  });
};

export const login = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then(user => {
      if (user == null) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid login details" }] });
      }
      const isMatch = bcrypt.compareSync(password, user.password);
      //TODO: Return The Jwt Token To The Frontend
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "invalid login details" }] });
      }
      const payload = {
        id: user._id
      };
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d"
      });
      const respData = {
        token
      };
      return res.send(createResponse("Login Successful", respData));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Connection Issue");
    });
};
