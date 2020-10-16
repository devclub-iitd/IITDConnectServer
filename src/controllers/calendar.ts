import Reminder from '../models/calendar-reminder';
import User from '../models/user';
import Event from '../models/event';
import {Request, Response, NextFunction} from 'express';
import {createError, createResponse} from '../utils/helpers';

//?Tested Ok
// Set reminder
export const setReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check user authentication
    // const user = await User.findById(req.payload.id);
    const user = await User.findOne({email:req.payload.email});
    if (!user) {
      throw createError(401, 'Unauthenticated', 'Authentication Failed');
    }
    const reminder = new Reminder({
      ...req.body,
      createdBy: user._id,
    });
    await reminder.save();
    res.send(createResponse('Reminder Added Succesfully', reminder));
  } catch (err) {
    return next(err);
  }
};

export const getReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await User.findById(req.payload.id);
    const user = await User.findOne({email:req.payload.email});
    if (!user) {
      throw createError(401, 'Unauthenticated', 'Authentication Failed');
    }
    // user has reminders as its virtual field stored
    await user.populate('reminders').execPopulate();
    res.send(createResponse('Successful', user.reminders));
  } catch (err) {
    return next(err);
  }
};

export const updateReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await User.findById(req.payload.id);
    const user = await User.findOne({email:req.payload.email});
    if (!user) {
      throw createError(401, 'Unauthenticated', 'Authentication Failed');
    }
    // verify allowed fields
    const allowedUpdates = [
      'name',
      'startDate',
      'endDate',
      'venue',
      'description',
      'color',
      'repeat',
      'participants',
      'url',
      'eventId',
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
    // finally update
    const reminder = await Reminder.findOne(
      {_id: req.params.id, createdBy: user._id},
      req.body
    );
    if (!reminder) {
      throw createError(401, 'Failure', 'Reminder with given id donot exists');
    }
    await reminder.update(req.body);
    res.send(createResponse('Update Successfull', reminder));
  } catch (err) {
    return next(err);
  }
};

export const deleteReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await User.findById(req.payload.id);
    const user = await User.findOne({email:req.payload.email});
    if (user === null) {
      throw createError(401, 'Unauthorized', 'authentication Failed');
    }
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      createdBy: user._id,
    });
    if (!reminder) {
      throw createError(401, 'Failure', 'Either id or the token is wrong');
    }
    await reminder.remove();
    res.send(createResponse('Reminder deleted Successfully', {}));
  } catch (error) {
    return next(error);
  }
};

export const getAllEventsAndReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await User.findById(req.payload.id);
    const user = await User.findOne({email:req.payload.email});
    if (!user) {
      throw createError(
        401,
        'Authentication Failed',
        'Authentication Failed. Login Again'
      );
    }
    // console.log(req.body.startDate);
    await user
      .populate({
        path: 'reminders',
        match: {
          $or: [
            {startDate: {$gte: req.body.startDate}},
            {endDate: {$lte: req.body.endDate}},
          ],
        },
      })
      .execPopulate();
    const event = await Event.find(
      {
        $or: [
          {
            startDate: {$gte: req.body.startDate, $lte: req.body.endDate},
          },
          {
            endDate: {$gte: req.body.startDate, $lte: req.body.endDate},
          },
        ],
      },
      {
        name: 1,
        startDate: 1,
        endDate: 1,
        topicName: 1,
      }
    );

    // starred event
    await user
      .populate({
        path: 'staredEvents',
        match: {
          $or: [
            {
              startDate: {$gte: req.body.startDate, $lte: req.body.endDate},
            },
            {
              endDate: {$gte: req.body.startDate, $lte: req.body.endDate},
            },
          ],
        },
        select: {
          name: 1,
          startDate: 1,
          endDate: 1,
          topicName: 1,
        },
      })
      .execPopulate();
    res.send(
      createResponse('SuccesFull', {
        reminders: user.reminders,
        staredEvents: user.staredEvents,
        event: event,
      })
    );
  } catch (err) {
    return next(err);
  }
};
