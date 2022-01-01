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
import fs = require('fs');
import {logger} from '../middleware/logger';

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
    const requestBody = req.body;
    //console.log(requestBody, typeof requestBody);
    const body = await Body.findById(requestBody.body);
    const user = await User.findById(req.payload);
    if (
      user === null ||
      body === null ||
      (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin)
    ) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const topic =
      slug(requestBody.name.toString()) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    //console.log('here-1');
    const newEvent = new Event({
      ...req.body,
      createdBy: user,
      topicName: topic,
    });

    if (req.file !== undefined) {
      newEvent.imageLink = req.file.path;
    }
    await newEvent.save();

    body.events.push(newEvent._id);
    await body.save();

    /**
     *  Push notification to Client from Firebase admin
     * Notification only to subscribed members of the body i.e body topic
     * **/
    if (process.env.NODE_ENV === 'production') {
      const message = {
        notification: {
          title: body.name + '-' + newEvent.name,
          body: newEvent.about,
          image: process.env.API_URL + newEvent.imageLink || '',
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          // status: '',
          screen: 'event',
          id: newEvent.id,
        },
        topic: body.topicName,
        //TODO Provide a unique topic to body as done in events
      };
      await admin.messaging().send(message);
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
    if (event.imageLink !== undefined && event.imageLink.startsWith('media/')) {
      fs.unlinkSync(event.imageLink);
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
          image: process.env.API_URL + event.imageLink || '',
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          // status: '',
          screen: 'event',
        },
        topic: body.topicName, // User subscribed to body should be notified
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
export const getEvent = async (req: Request, res: Response) => {
  const [user, event] = await Promise.all([
    User.findById(req.payload),
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
    User.findById(req.payload),
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

// Updates regarding to events changes , etc major changes
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

    /**
     * Sending Firebase Notification
     */
    if (process.env.NODE_ENV === 'production') {
      const message = {
        notification: {
          title: event.name + ' Updated',
          body: 'There are new updates to the ' + event.name,
          image: process.env.API_URL + event.imageLink || '',
        },
        data: {
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
          sound: 'default',
          // status: '',
          screen: 'event',
          id: event.id,
        },
        topic: event.topicName,
        //TODO Provide a unique topic to body as done in events
      };
      await admin.messaging().send(message);
      logger.info('Event -' + event + 'Updated successfully');
    }
    res.send(createResponse('Update Added Successfully', newUpdate));
  } catch (error) {
    next(error);
  }
};

export const toggleSubscribeEventNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    if (req.body.eventNotifications !== user.notifications.eventNotifications) {
      user.notifications.eventNotifications =
        !user.notifications.eventNotifications;

      await user.save();

      /**
       * Firebase notifications : Subscribing/Unsubscribing Topics from user
       */
      const starredEvents = await Event.find(
        {_id: {$in: user.staredEvents}},
        {topicName: 1}
      );
      const subscribedBodies = await Body.find(
        {_id: {$in: user.subscribedBodies}},
        {topicName: 1}
      );
      if (process.env.NODE_ENV === 'production') {
        if (user.notifications.eventNotifications) {
          // resubscribe user to starred event topics and subscribed Bodies for notifications
          await Promise.all(
            starredEvents.map(async event => {
              await admin
                .messaging()
                .subscribeToTopic(user.fcmRegistrationToken, event.topicName);
              //user.subscribedTopics.events.push(event.topicName);
              logger.debug(
                'user ->' +
                  user.name +
                  ' Subscribed to event topic -> ' +
                  event.topicName
              );
            })
          );
          for (const event of starredEvents) {
            user.subscribedTopics.events.push(event.topicName);
          }
          // starredEvents.forEach(async event => {
          //   await admin
          //     .messaging()
          //     .subscribeToTopic(user.fcmRegistrationToken, event.topicName);
          //   user.subscribedTopics.events.push(event.topicName);
          //   logger.debug(
          //     'user ->' +
          //       user.name +
          //       ' Subscribed to event topic -> ' +
          //       event.topicName
          //   );
          // });

          await Promise.all(
            subscribedBodies.map(async body => {
              await admin
                .messaging()
                .subscribeToTopic(user.fcmRegistrationToken, body.topicName);
              //user.subscribedTopics.bodies.push(body.topicName);
              logger.debug(
                'user ->' +
                  user.name +
                  ' Subscribed to body topic -> ' +
                  body.topicName
              );
            })
          );
          for (const body of subscribedBodies) {
            user.subscribedTopics.bodies.push(body.topicName);
          }
          // subscribedBodies.forEach(async body => {
          //   await admin
          //     .messaging()
          //     .subscribeToTopic(user.fcmRegistrationToken, body.topicName);
          //   user.subscribedTopics.bodies.push(body.topicName);
          //   logger.debug(
          //     'user ->' +
          //       user.name +
          //       ' Subscribed to event topic -> ' +
          //       body.topicName
          //   );
          // });
        }
        // unsubscribe to the starred events
        else {
          await Promise.all(
            starredEvents.map(async event => {
              await admin
                .messaging()
                .unsubscribeFromTopic(
                  user.fcmRegistrationToken,
                  event.topicName
                );
              // const ind = user.subscribedTopics.events.indexOf(event.topicName);
              // if (ind !== -1) {
              //   user.subscribedTopics.events.splice(ind, 1);
              // }
              logger.debug(
                'user ->' +
                  user.name +
                  ' UnSubscribed to event topic -> ' +
                  event.topicName
              );
            })
          );
          for (const event of starredEvents) {
            const ind = user.subscribedTopics.events.indexOf(event.topicName);
            if (ind !== -1) {
              user.subscribedTopics.events.splice(ind, 1);
            }
          }
          // starredEvents.forEach(async event => {
          //   await admin
          //     .messaging()
          //     .unsubscribeFromTopic(user.fcmRegistrationToken, event.topicName);
          //   const ind = user.subscribedTopics.events.indexOf(event.topicName);
          //   if (ind !== -1) {
          //     user.subscribedTopics.events.splice(ind, 1);
          //   }
          //   logger.debug(
          //     'user ->' +
          //       user.name +
          //       ' UnSubscribed to body topic -> ' +
          //       event.topicName
          //   );
          // });
          await Promise.all(
            subscribedBodies.map(async body => {
              await admin
                .messaging()
                .unsubscribeFromTopic(
                  user.fcmRegistrationToken,
                  body.topicName
                );

              // const ind = user.subscribedTopics.bodies.indexOf(body.topicName);
              // if (ind !== -1) {
              //   user.subscribedTopics.bodies.splice(ind, 1);
              // }
              logger.debug(
                'user ->' +
                  user.name +
                  ' UnSubscribed to body topic -> ' +
                  body.topicName
              );
            })
          );
          for (const body of subscribedBodies) {
            const ind = user.subscribedTopics.bodies.indexOf(body.topicName);
            if (ind !== -1) {
              user.subscribedTopics.bodies.splice(ind, 1);
            }
          }
          // subscribedBodies.forEach(async body => {
          //   await admin
          //     .messaging()
          //     .unsubscribeFromTopic(user.fcmRegistrationToken, body.topicName);

          //   const ind = user.subscribedTopics.bodies.indexOf(body.topicName);
          //   if (ind !== -1) {
          //     user.subscribedTopics.bodies.splice(ind, 1);
          //   }
          //   logger.debug(
          //     'user ->' +
          //       user.name +
          //       ' UnSubscribed to body topic -> ' +
          //       body.topicName
          //   );
          // });
        }
      }
    }
    await user.save();
    res.send(
      createResponse('Success', {
        message: 'toggled Successfully',
        eventNotifications: user.notifications.eventNotifications,
      })
    );
  } catch (error) {
    next(error);
  }
};
export const toggleStarEvent = async (
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
    const index = user.staredEvents.indexOf(new Types.ObjectId(req.params.id));
    if (index === -1) {
      user.staredEvents.push(new Types.ObjectId(req.params.id));
      user.subscribedTopics.events.push(event.topicName);
      //Subscribe the user to this event
      if (
        process.env.NODE_ENV === 'production' &&
        user.notifications.eventNotifications
      ) {
        await admin
          .messaging()
          .subscribeToTopic(user.fcmRegistrationToken, event.topicName);
      }
    } else {
      user.staredEvents.splice(index, 1);
      const ind = user.subscribedTopics.events.indexOf(event.topicName);
      if (ind !== -1) {
        user.subscribedTopics.events.splice(ind, 1);
      }
      //UnSubscribe the user to this event
      if (
        process.env.NODE_ENV === 'production' &&
        user.notifications.eventNotifications
      ) {
        await admin
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

/**
 * Inplace Update of an event , for-example for the typos and all
 * **/
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
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
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
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Update fields do not match',
        'Following fields can only be updated ' + allowedUpdates
      );
    }
    if (req.file !== undefined) {
      req.body.imageLink = req.file.path;
    }

    if (req.body.imageLink !== undefined) {
      const oldEvent = await Event.findById(req.params.id);
      if (
        oldEvent !== null &&
        oldEvent.imageLink !== undefined &&
        oldEvent.imageLink.startsWith('media/')
      ) {
        fs.unlinkSync(oldEvent.imageLink);
      }
    }
    // Finally updating
    await Event.findByIdAndUpdate(req.params.id, req.body);

    res.send(createResponse('Event Updated Succesfully', {id: req.params.id}));
  } catch (error) {
    next(error);
  }
};
