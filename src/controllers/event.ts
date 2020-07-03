/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as slug from 'slug';
import {validationResult} from 'express-validator/check';
import {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {createError, createResponse} from '../utils/helpers';
import Event, {EventImpl} from '../models/event';
import User, {UserImpl} from '../models/user';
import {Body} from '../models/body';
import Update from '../models/update';
// import Body from "../models/body";

const toEventJSON = (event: EventImpl, user: UserImpl) => {
  const isStarred = user.staredEvents.some(starId => {
    return starId.toString() === event.id.toString();
  });
  if (event.body instanceof Body) {
    const bId = event.body.id.toString();
    const isSub = user.subscribedBodies.some(bodyId => {
      return bodyId.toString() === bId;
    });
    const temp = {
      id: event.id,
      name: event.name,
      about: event.about,
      body: {
        name: event.body.name,
        about: event.body.about,
        id: event.body.id,
        isSub: isSub,
      },
      startDate: event.startDate,
      endDate: event.endDate,
      stared: isStarred,
      image: event.imageLink,
      venue: event.venue,
      updates: event.updates,
    };
    return temp;
  }
  //TODO: Return proper error.
  return null;
};

export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors) {
    throw createError(400, 'Validation Error', 'Validation Error');
  }

  try {
    const body = await Body.findById(req.body.body);
    const user = await User.findById(req.payload.id);
    if (user === null || body === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const topic =
      slug(req.body.name) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);

    const newEvent = new Event({
      ...req.body,
      createdBy: user,
      topicName: topic,
    });
    await newEvent.save();

    body.events.push(newEvent._id);
    await body.save();
    res.send(createResponse('Event Added Successfully', {newEvent}));
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  if (event === null) {
    return res.send('Invalid');
  }
  await Body.update({_id: event.body}, {$pull: {events: event.id}});
  await event.remove();
  return res.send('Event Was Successfully Removed');
};

export const getEvent = async (req: Request, res: Response) => {
  const [user, event] = await Promise.all([
    User.findById(req.payload.id),
    Event.findById(req.params.id).populate('body').populate('updates').exec(),
  ]);
  if (user === null || event === null) {
    return res.status(400).json({message: 'Error'});
  }
  // console.log(event);
  const respData = {
    event: toEventJSON(event, user),
  };
  return res.send(respData);
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //!TODO IF WE WANT TO ADD THE OPTION TO FILTER BY CLUB OR YEAR OR ANYTHING
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};
  if (typeof req.query.body !== 'undefined') {
    query.body = req.query.body;
  }
  return Promise.all([
    Event.find(query)
      // .sort({ endDate: "desc" })
      .populate('body')
      .populate('updates')
      .exec(),
    User.findById(req.payload.id),
  ])
    .then(([events, user]) => {
      if (user === null) {
        throw createError(401, 'Unauthorized', 'Invalid');
      }
      if (events !== null) {
        const respData = {
          events: events.map(event => toEventJSON(event, user)),
        };
        return res.send(createResponse('Events Found', respData));
      }
      const respData = {
        events: [],
      };
      return res.send(createResponse('Events Found', respData));
    })
    .catch(e => {
      next(e);
    });
};

//TODO: ADD THE SUPPORT FOR PUSH NOTIFICATIONS
export const addUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Event.findById(req.params.id)
    .then(event => {
      if (event === null) {
        throw createError(400, 'Invalid', 'No Such Event Exists');
      }
      const newUpdate = new Update(req.body);
      return Promise.all([newUpdate.save(), event]);
    })
    .then(([update, event]) => {
      event.updates.push(update.id);
      return event.save();
    })
    .then(() => {
      return res.json({
        message: 'Update Added Successfully',
      });
      // const message = {
      //   topic: "DevClub",
      //   notification: {
      //     title: "Notification Title",
      //     body: "Notification Body"
      //   }
      // };
      // return admin.messaging().send(message);
    })
    // .then(() => {
    //   return res.json({
    //     message: "Update Added Successfully"
    //   });
    // })
    .catch(err => next(err));
};

export const toggleStar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.all([
    User.findById(req.payload.id),
    Event.findById(req.params.id),
  ])
    .then(([user, event]) => {
      if (user === null || event === null) {
        throw createError(401, 'Unauthorized', 'Invalid Login Credentials');
      }
      const index = user.staredEvents.indexOf(Types.ObjectId(req.params.id));
      if (index === -1) {
        user.staredEvents.push(Types.ObjectId(req.params.id));
        return Promise.all([
          user.save(),
          // admin
          //   .messaging()
          //   .subscribeToTopic(user.fcmRegistrationToken, event.topicName)
        ]);
      } else {
        user.staredEvents.splice(index, 1);
        return Promise.all([
          user.save(),
          // admin
          //   .messaging()
          //   .unsubscribeFromTopic(user.fcmRegistrationToken, event.topicName)
        ]);
      }
    })
    .then(() => {
      // console.log("Successfully subscribed to topic:", response);
      return res.status(200).json({
        message: 'Successfully Starred',
      });
    })
    .catch(e => next(e));
};

export const removeUpdate = async (req: Request, res: Response) => {
  const event = await Event.findById(req.params.id);
  const update = await Update.findById(req.body.updateId);
  if (event === null || update === null) {
    return res.send('Invalid');
  }
  await Event.update({_id: req.params.id}, {$pull: {updates: update.id}});
  await update.remove();
  return res.send('Update Was Successfully Removed');
};

export const putUpdateEvent = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Promise.all([
    Event.findById(req.params.id),
    User.findById(req.payload.id),
  ])
    .then(([event, user]) => {
      if (event === null || user === null) {
        throw createError(400, 'Invalid', 'No Such Event Exists');
      }
      if (req.body.name !== null) {
        event.name = req.body.name;
      }
      if (req.body.about !== null) {
        event.about = req.body.about;
      }
      if (req.body.imageLink !== null) {
        event.imageLink = req.body.imageLink;
      }
      if (req.body.venue !== null) {
        event.venue = req.body.venue;
      }
      if (req.body.startDate !== null) {
        event.startDate = req.body.startDate;
      }
      if (req.body.endDate !== null) {
        event.endDate = req.body.endDate;
      }
      event.save().then(event => {
        // const respData = {
        //   event: toEventJSON(event, user)
        // };
        // console.log(respData);
        const respData = {
          id: event._id,
        };
        return res.send(createResponse('Event Updated Successfully', respData));
      });
    })
    .catch(e => {
      next(e);
    });
};
