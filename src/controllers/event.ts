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
import admin = require('firebase-admin');

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
    const user = await User.findById(req.payload);
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

    //Push notification to Client from Firebase admin
    if (process.env.NODE_ENV === 'production') {
      const message = {
        notification: {
          title: body.name + '-' + newEvent.name,
          body: newEvent.about,
        },
        topic: body.name,
        //TODO Provide a unique topic to body as done in events
      };
      admin
        .messaging()
        .send(message)
        .then(() => {
          console.log('Message sent successfully');
        })
        .catch(() => {
          console.log('Message could not be sent');
        });
    }
    res.send(createResponse('Event Added Successfully', {newEvent}));
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event === null) {
      throw createError(400, 'Invalid', 'Event Id Invalid');
    }
    await Body.update({_id: event.body}, {$pull: {events: event.id}});
    await event.remove();
    const body = await Body.findById(event.body);
    //Push notification to Client from Firebase admin
    if (process.env.NODE_ENV === 'production' && body) {
      const message = {
        notification: {
          title: body.name + '-' + event.name,
          body: 'Event Cancelled',
        },
        topic: body.name, // User subscribed to body should be notified
      };
      await admin.messaging().send(message);
    }
    res.send(
      createResponse(
        'Event Was Successfully Removed',
        'Subscribed users notified'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const getStarredEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);

    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const starredEvents = user.staredEvents;
    res.send(createResponse('Starred Events', starredEvents));
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    const event = await Event.findById(req.params.id)
      .populate('body')
      .populate('updates');
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    if (event === null) {
      throw createError(400, 'Error ', 'Invalid Event');
    }
    // console.log(event);
    const body = await Body.findById(event.body);
    if (!body) {
      throw createError(400, 'Error ', 'Invalid');
    }
    const members = body.members;
    const valid_member = members.filter(member => {
      return member.userId.toString() === user._id.toString();
    });
    // console.log(valid_member);
    if (event.private === false || valid_member.length !== 0) {
      const respData = {
        event: toEventJSON(event, user),
      };
      res.send(createResponse('Event Found', respData));
    } else {
      throw createError(400, 'Error', 'Event is not public');
    }
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //!TODO IF WE WANT TO ADD THE OPTION TO FILTER BY CLUB OR YEAR OR ANYTHING
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    let events;
    let priv = false;
    if (req.query) {
      if (req.query.p === '1') {
        priv = true;
      }
    }
    events = await Event.find({private: priv})
      .populate('body')
      .populate('updates');
    // events = await Event.find().populate('body').populate('updates');
    if (priv) {
      //using maps to return an array of promises
      const promises = events.map(event => Body.findById(event.body));
      const bodies = await Promise.all(promises);
      const fevents = events.filter((event, index) => {
        const body = bodies[index];
        if (!body) {
          return false;
        }
        const members = body.members;
        const valid_member = members.filter(member => {
          return member.userId.toString() === user._id.toString();
        });
        if (valid_member.length !== 0) {
          return true;
        } else {
          return false;
        }
      });
      events = fevents;
    }

    let respData;
    if (events !== null) {
      respData = {
        events: events.map(event => toEventJSON(event, user)),
      };
    } else {
      respData = {
        events: [],
      };
    }
    res.send(createResponse('Events Found', respData));
  } catch (error) {
    next(error);
  }
};

export const addUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw createError(400, 'Invalid', 'No Such Event Exists');
    }
    const newUpdate = new Update(req.body);
    await newUpdate.save();
    event.updates.push(newUpdate.id);
    await event.save();

    if (process.env.NODE_ENV === 'production') {
      const message = {
        notification: {
          title: event.topicName + '- New Update, Important',
        },
        topic: event.topicName,
      };
      await admin.messaging().send(message);
      console.log('Users who starred the event , are notified');
    }
    res.send(createResponse('Update Added Successfully', newUpdate));
  } catch (error) {
    next(error);
  }
};

export const toggleStar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    const event = await Event.findById(req.params.id);
    if (user === null || event === null) {
      throw createError(401, 'Unauthorized', 'Invalid Login Credentials');
    }
    const index = user.staredEvents.indexOf(Types.ObjectId(req.params.id));
    if (index === -1) {
      user.staredEvents.push(Types.ObjectId(req.params.id));
      //Subscribe the user to this event
      if (process.env.NODE_ENV === 'production') {
        admin
          .messaging()
          .subscribeToTopic(user.fcmRegistrationToken, event.topicName);
      }
    } else {
      user.staredEvents.splice(index, 1);
      //UnSubscribe the user to this event
      if (process.env.NODE_ENV === 'production') {
        admin
          .messaging()
          .unsubscribeFromTopic(user.fcmRegistrationToken, event.topicName);
      }
    }
    await user.save();
    res.send(
      createResponse('Successfully Starred', 'Event Starred Successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const removeUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const event = await Event.findById(req.params.id);
    const update = await Update.findById(req.body.updateId);
    if (event === null || update === null) {
      throw createError(400, 'Invalid', 'Event or Update not found');
    }
    await Event.update({_id: req.params.id}, {$pull: {updates: update.id}});
    await update.remove();
    res.send('Update Was Successfully Removed');
  } catch (error) {
    next(error);
  }
};

export const putUpdateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [event, user] = await Promise.all([
      Event.findById(req.params.id),
      User.findById(req.payload),
    ]);
    if (event === null || user === null) {
      throw createError(400, 'Invalid', 'No Such Event Exists');
    }
    // verify allowed fields
    const allowedUpdates = [
      'name',
      'about',
      'imageLink',
      'venue',
      'startDate',
      'endDate',
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      res.send(
        createResponse(
          'Update fields donot match. Following can only be updated',
          allowedUpdates
        )
      );
    }
    // Finally updating
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body);
    let respData = {};
    if (updatedEvent) {
      respData = {
        id: updatedEvent._id,
      };
    }
    res.send(createResponse('Event Updated Succesfully', respData));
  } catch (error) {
    next(error);
  }
};
