import Reminder from '../models/calendar-reminder';
import User from '../models/user';
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
    const user = await User.findById(req.payload.id);
    if (!user) {
      throw createError(500, 'Unauthenticated', 'Authentication Failed');
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
    const user = await User.findById(req.payload.id);
    if (!user) {
      throw createError(500, 'Unauthenticated', 'Authentication Failed');
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
    const user = await User.findById(req.payload.id);
    if (!user) {
      throw createError(500, 'Unauthenticated', 'Authentication Failed');
    }
    // verify allowed fields
    const allowedUpdates = ['title', 'startTime', 'endTime', 'venue'];
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
      throw createError(400, 'Failure', 'Reminder with given id donot exists');
    }
    await reminder.update(req.body);
    res.send('Update Successfull');
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
    const user = await User.findById(req.payload.id);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'authentication Failed');
    }
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      createdBy: user._id,
    });
    if (!reminder) {
      throw createError(404, 'Failure', 'Either id or the token is wrong');
    }
    await reminder.remove();
    res.send(createResponse('Reminder deleted Successfully', {}));
  } catch (error) {
    return next(error);
  }
};
