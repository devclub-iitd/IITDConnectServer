/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import admin from "firebase-admin";
import slug from "slug";
import { validationResult } from "express-validator/check";
import { Request, Response, NextFunction } from "express";
import { createError, createResponse } from "../utils/helpers";
import Event, { EventImpl } from "../models/event";
import User, { UserImpl } from "../models/user";
import Update from "../models/update";
// import Body from "../models/body";

//TODO! :- start and end time, just body name and id
//TODO! :- add the functionality to delete,edit event , delete update

const toEventJSON = (event: EventImpl, user: UserImpl) => {
  const isStarred = user.staredEvents.some(starId => {
    return starId.toString() === event.id.toString();
  });
  // if (event.body instanceof Body) {
  //   return {
  //     name: event.name,
  //     about: event.about,
  //     body: event.body,
  //     startDate: event.startDate,
  //     endDate: event.endDate,
  //     stared: isStarred,
  //     image: event.imageLink,
  //     venue: event.venue
  //   };
  // }
  return {
    name: event.name,
    about: event.about,
    body: event.body,
    startDate: event.startDate,
    endDate: event.endDate,
    stared: isStarred,
    image: event.imageLink,
    venue: event.venue
  };
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Event Creation Failed",
      errors: errors.array()
    });
  }

  User.findById(req.payload.id).then(user => {
    if (user === null) {
      throw createError(401, "Unauthorized", "Invalid");
    }
    const topic =
      slug(req.body.name) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    const newEvent = new Event({
      ...req.body,
      createdBy: user,
      topicName: topic
    });
    newEvent
      .save()
      .then(event => {
        const respData = {
          event: {
            name: event.name,
            about: event.about,
            body: event.body,
            startDate: event.startDate,
            endDate: event.endDate,
            image: event.imageLink,
            venue: event.venue
          }
        };
        return res.send(createResponse("Event Created Successfully", respData));
      })
      .catch(err => {
        next(err);
      });
  });
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Event.findByIdAndRemove(req.body.eventId).then(e => {
    return res.send("Event Was Successfully Removed");
  });
};

export const getEvent = async (req: Request, res: Response) => {
  return Promise.all([
    User.findById(req.payload.id),
    Event.findById(req.params.id)
  ])
    .then(([user, event]) => {
      if (user && event) {
        const respData = {
          event: toEventJSON(event, user)
        };
        return res.send(createResponse("Found Event", respData));
      }
      throw createError(401, "Unauthorized", "Invalid");
    })
    .catch(() => res.status(400).json({ message: "Error" }));
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //!TODO IF WE WANT TO ADD THE OPTION TO FILTER BY DEPARTMENT OR YEAR OR ANYTHING
  let query = {};
  return Promise.all([
    Event.find(query)
      // .sort({ endDate: "desc" })
      // .populate("body")
      .exec(),
    User.findById(req.payload.id)
  ])
    .then(([events, user]) => {
      if (user === null) {
        throw createError(401, "Unauthorized", "Invalid");
      }
      const respData = {
        events: events.map(event => toEventJSON(event, user))
      };
      res.send(createResponse("Events Found", respData));
    })
    .catch(e => {
      next(e);
    });
};

export const addUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Event.findById(req.params.id)
    .then(event => {
      if (event === null) {
        throw createError(400, "Invalid", "No Such Event Exists");
      }
      const newUpdate = new Update(req.body);
      return Promise.all([newUpdate.save(), event]);
    })
    .then(([update, event]) => {
      event.updates.push(update.id);
      return event.save();
    })
    .then(() => {
      const message = {
        topic: "DevClub",
        notification: {
          title: "Notification Title",
          body: "Notification Body"
        }
      };
      return admin.messaging().send(message);
    })
    .then(() => {
      return res.json({
        message: "Update Added Successfully"
      });
    })
    .catch(err => next(err));
};

export const toggleStar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.all([
    User.findById(req.payload.id),
    Event.findById(req.params.id)
  ])
    .then(([user, event]) => {
      if (user === null || event === null) {
        throw createError(401, "Unauthorized", "Invalid Login Credentials");
      }
      const index = user.staredEvents.indexOf(req.params.id);
      if (index === -1) {
        user.staredEvents.push(req.params.id);
        return Promise.all([
          user.save(),
          admin
            .messaging()
            .subscribeToTopic(user.fcmRegistrationToken, event.topicName)
        ]);
      } else {
        user.staredEvents.splice(index, 1);
        return Promise.all([
          user.save(),
          admin
            .messaging()
            .unsubscribeFromTopic(user.fcmRegistrationToken, event.topicName)
        ]);
      }
    })
    .then(([, response]) => {
      console.log("Successfully subscribed to topic:", response);
      return res.status(200).json({
        message: "Successfully Subscribed"
      });
    })
    .catch(e => next(e));
};
