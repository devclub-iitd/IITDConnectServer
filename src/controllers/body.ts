/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";
import { createError, createResponse } from "../utils/helpers";

// import { validationResult } from "express-validator/check";

import User, { UserImpl } from "../models/user";
import Body, { BodyImpl } from "../models/body";

const toBodyJSON = (body: BodyImpl, user: UserImpl) => {
  const isSub = user.subscribedBodies.some(bodyId => {
    return bodyId.toString() === body.id.toString();
  });
  return {
    name: body.name,
    about: body.about,
    department: body.department,
    isSub: isSub
  };
};

export const addBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newBody = new Body(req.body);
  newBody
    .save()
    .then(body => {
      const respData = {
        body: {
          name: body.name
        }
      };
      return res.send(createResponse("Body Created Successfully", respData));
    })
    .catch(err => {
      next(err);
    });
};

export const getAllBodies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.all([User.findById(req.payload.id), Body.find()])
    .then(([user, bodies]) => {
      if (user === null) {
        return null;
      }
      return res.status(200).json({
        bodies: bodies.map(body => toBodyJSON(body, user))
      });
    })
    .catch(err => next(err));
};

export const getBody = (req: Request, res: Response) => {
  return Promise.all([
    User.findById(req.payload.id),
    Body.findById(req.params.id)
  ]).then(([user, body]) => {
    if (user !== null && body !== null) {
      return res.status(200).json({
        body: toBodyJSON(body, user)
      });
    }
    return null;
  });
};

export const toggleSubscribe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null) {
      //! JWT WAS INVALID
      return null;
    }
    const index = user.subscribedBodies.indexOf(req.params.id);
    if (index === -1) {
      user.subscribedBodies.push(req.params.id);
    } else {
      user.subscribedBodies.splice(index, 1);
    }
    await user.save();
    return res.status(200).json({
      message: "Successfully Toggled Subscribe"
    });
  } catch (error) {
    next(error);
  }
};

// export const toggleSubscribe = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   return Promise.all([
//     User.findById(req.payload.id),
//     Body.findById(req.params.id)
//   ])
//     .then(([user, body]) => {
//       if (user === null || body === null) {
//         throw createError(401, "Unauthorized", "Invalid Login Credentials");
//       }
//       const index = user.subscribedBodies.indexOf(body._id);
//       if (index === -1) {
//         user.subscribedBodies.push(req.params.id);
//         return Promise.all([
//           user.save(),
//           admin
//             .messaging()
//             .subscribeToTopic(user.fcmRegistrationToken, body.name)
//         ]);
//       } else {
//         user.subscribedBodies.splice(index, 1);
//         return Promise.all([
//           user.save(),
//           admin
//             .messaging()
//             .unsubscribeFromTopic(user.fcmRegistrationToken, body.name)
//         ]);
//       }
//     })
//     .then(([, response]) => {
//       console.log("Successfully subscribed to topic:", response);
//       return res.status(200).json({
//         message: "Successfully Subscribed"
//       });
//     })
//     .catch(e => next(e));
// };
