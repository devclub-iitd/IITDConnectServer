/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator/check";
import { Request, Response, NextFunction } from "express";
import Event, { EventImpl } from "../models/event";
import User, { UserImpl } from "../models/user";
import Body from "../models/body";
// import Body from "../models/body";

const toArticleJSON = (event: EventImpl, user: UserImpl) => {
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

export const createEvent = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Event Creation Failed",
      errors: errors.array()
    });
  }

  try {
    const user = await User.findById(req.payload.id);
    // const body = await Body.findOne({});
    if (!user) {
      return res.sendStatus(401);
    }
    const newEvent = new Event({ ...req.body, createdBy: user });
    await newEvent.save();
    return res.status(200).json({
      message: "Event Created Successfully"
    });
  } catch (error) {
    console.log(error);
    //TODO: Send The Error In A Proper Structure
    return res.status(500).send("Connection Issue");
  }
};

export const getEvent = async (req: Request, res: Response) => {
  return Promise.all([
    User.findById(req.payload.id),
    Event.findById(req.params.id)
  ])
    .then(([user, event]) => {
      if (user && event) {
        return res.status(200).json({
          event: event
        });
      }
      return null;
    })
    .catch(() => res.status(400).json({ message: "Error" }));
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //TODO: IF WE WANT TO ADD THE OPTION TO FILTER BY DEPARTMENT OR YEAR OR ANYTHING
  let query = {};
  try {
    const [events, user] = await Promise.all([
      Event.find(query)
        // .sort({ endDate: "desc" })
        // .populate("body")
        .exec(),
      User.findById(req.payload.id)
    ]);
    if (user) {
      return res.status(200).json({
        events: events.map(event => toArticleJSON(event, user))
      });
    }
    return null;
  } catch (err) {
    next(err);
  }
  return null;
};

export const toggleStar = async (
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
    const index = user.staredEvents.indexOf(req.params.id);
    if (index === -1) {
      user.staredEvents.push(req.params.id);
    } else {
      user.staredEvents.splice(index, 1);
    }
    await user.save();
    return res.status(200).json({
      message: "Successfully Toggled Star"
    });
  } catch (error) {
    next(error);
  }
  return null;
  // User.findById(req.payload.id)
  //   .then(user => {
  //     if (user === null) {
  //       return null;
  //     }
  //     const index = user.staredEvents.indexOf(req.params.id);
  //     if (index === -1) {
  //       user.staredEvents.push(req.params.id);
  //     } else {
  //       user.staredEvents.splice(index, 1);
  //     }
  //     return user.save();
  //   })
  //   .then(() => {
  //     return res.status(200).json({
  //       message: "Successfully Toggled"
  //     });
  //   })
  //   .catch((err: Error) => {
  //     next(err);
  //   });
};
