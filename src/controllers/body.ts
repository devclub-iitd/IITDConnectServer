/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as slug from 'slug';
import {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {createResponse, createError} from '../utils/helpers';

import User, {UserImpl} from '../models/user';
import {Body, BodyMember, BodyImpl} from '../models/body';
import * as admin from 'firebase-admin';
// import {nextTick} from 'process';
import fs = require('fs');
// import {logger} from '../middleware/logger';

const toBodyJSON = (body: BodyImpl, user: UserImpl) => {
  const isSub = user.subscribedBodies.some(bodyId => {
    return bodyId.toString() === body.id.toString();
  });
  return {
    body,
    isSub: isSub,
  };
};

export const addBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);

    if (user === null || user.superSuperAdmin === false) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const topic = slug(req.body.name.toString());
    const newBody = new Body({...req.body, topicName: topic});
    if (req.file !== undefined) {
      newBody.imageUrl = req.file.path;
    }
    await newBody.save();
    res.send(createResponse('Body Created Successfully', newBody));
  } catch (error) {
    next(error);
  }
};

export const getAllBodies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const filterVal = (req.query.q):
    const user = await User.findById(req.payload);
    if (!user) {
      throw createError(404, 'Authentication failed', 'Invalid Credentials');
    }
    let bodies;
    if (req.query.q) {
      bodies = await Body.find({typeOfBody: parseInt(req.query.q.toString())});
    } else {
      bodies = await Body.find({});
    }
    const respData = await bodies.map(body => toBodyJSON(body, user));
    res.send(createResponse('Success', respData));
  } catch (error) {
    next(error);
  }
};

export const getBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user, body] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.params.id),
    ]);

    if (user === null || body === null) {
      throw createError(
        404,
        'Invalid User id or club id',
        'Invalid credentials'
      );
    }
    res.send(createResponse('Success', body));
  } catch (err) {
    next(err);
  }
};

export const updateBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [body, user] = await Promise.all([
      Body.findById(req.params.id),
      User.findById(req.payload),
    ]);
    if (body === null || user === null) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(400, 'Invalid', 'No Such Body Exists');
    }
    if (!body.superAdmin && user.superSuperAdmin === false) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Superadmin for the body donot exist, cannot update body. First create superAdmin',
        ''
      );
    }
    if (
      user.superSuperAdmin === false &&
      !body.superAdmin.equals(req.payload)
    ) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Not Authorized',
        'Only users of superadmin status are allowed to update body'
      );
    }
    if (req.file !== undefined) {
      req.body.imageUrl = req.file.path;
    }

    if (req.body.imageUrl !== undefined) {
      if (body.imageUrl !== undefined && body.imageUrl.startsWith('media/')) {
        fs.unlinkSync(body.imageUrl);
      }
    }
    await body.update(req.body);
    await body.save();
    res.send(createResponse('Sucess', req.body));
  } catch (error) {
    next(error);
  }
};
export const toggleSubscribeBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      //! JWT WAS INVALID
      return res.send('Invalid Request');
    }
    const body = await Body.findById(req.params.id);
    if (!body) {
      throw createError(400, 'Invalid request', 'Body doesnot exists');
    }
    const index = user.subscribedBodies.indexOf(
      new Types.ObjectId(req.params.id)
    );
    if (index === -1) {
      //subscibe
      user.subscribedBodies.push(new Types.ObjectId(req.params.id));
      if (
        process.env.NODE_ENV === 'production' &&
        user.notifications.eventNotifications
      ) {
        // Subscribe user to Firebase topic of the current body

        await admin
          .messaging()
          .subscribeToTopic(user.fcmRegistrationToken, body.topicName);
        // logger.info(`${user.name} subscribed to topic ${body.name}`);
      }
    } else {
      //unsubscribe
      user.subscribedBodies.splice(index, 1);
      if (
        process.env.NODE_ENV === 'production' &&
        user.notifications.eventNotifications
      ) {
        // UnSubscribe user to Firebase topic of the current body

        await admin
          .messaging()
          .unsubscribeFromTopic(user.fcmRegistrationToken, body.topicName);
        // logger.info(`${user.name} unsubscribed to topic ${body.name}`);
      }
    }

    await user.save();
    return res.status(200).json({
      message: 'Successfully Toggled Subscribe',
    });
  } catch (error) {
    return next(error);
  }
};

export const addMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [superadmin, body] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.body.bodyId),
    ]);
    if (superadmin === null || body === null) {
      throw createError(
        400,
        'Invalid Request',
        'Invalid credentials or request'
      );
    }
    if (!body.superAdmin) {
      throw createError(
        400,
        'Superadmin for the body donot exists, cannot add members',
        ''
      );
    }
    if (!body.superAdmin.equals(req.payload)) {
      throw createError(
        400,
        'Not Authorized',
        'Only users of superadmin status are allowed to add The members'
      );
    }
    const member = new BodyMember(req.body.member);
    if (body.members.includes(member)) {
      //if image is uploaded then this would never arise as time would be different
      throw createError(
        400,
        'Already Exists',
        'The given member already exists'
      );
    }
    body.members.push(member);
    await body.save();
    await member.save();

    res.send(createResponse('Sucess', member));
  } catch (error) {
    next(error);
  }
};

export const addMemberImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user, body, bodyMember] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.body.bodyId),
      BodyMember.findById(req.body.memberId),
    ]);
    if (user === null || body === null || bodyMember === null) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Invalid Request',
        'Invalid credentials or request'
      );
    }
    if (!body.superAdmin) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Superadmin for the body donot exists, cannot add member image',
        ''
      );
    }
    if (!body.superAdmin.equals(req.payload)) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Not Authorized',
        "Only users of superadmin status are allowed to add member's image"
      );
    }
    if (req.file !== undefined) {
      req.body.imgUrl = req.file.path;
    }
    bodyMember.imgUrl = req.body.imgUrl;
    await bodyMember.save();
    res.send(createResponse('Sucess', bodyMember));
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user, body, bodyMember] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.body.bodyId),
      BodyMember.findById(req.body.memberId),
    ]);
    if (user === null || body === null || bodyMember === null) {
      throw createError(
        400,
        'Invalid Request',
        'Invalid credentials or request'
      );
    }
    if (!body.superAdmin) {
      throw createError(
        400,
        'Superadmin for the body donot exists, cannot update member',
        ''
      );
    }
    if (!body.superAdmin.equals(req.payload)) {
      throw createError(
        400,
        'Not Authorized',
        'Only users of superadmin status are allowed to update members'
      );
    }
    // verify allowed fields
    const allowedUpdates = ['por', 'link'];
    const updates = Object.keys(req.body.member);
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      throw createError(
        400,
        'Update fields do not match',
        'Following fields can only be updated ' + allowedUpdates
      );
    }
    // Finally updating
    await BodyMember.findByIdAndUpdate(req.body.memberId, req.body.member);

    const updatedMember = await BodyMember.findById(req.body.memberId);
    let respData = {};
    if (updatedMember) {
      respData = {
        id: updatedMember._id,
      };
    }
    res.send(createResponse('Member Updated Succesfully', respData));
  } catch (error) {
    next(error);
  }
};

export const updateMemberImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [user, body, bodyMember] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.body.bodyId),
      BodyMember.findById(req.body.memberId),
    ]);
    if (user === null || body === null || bodyMember === null) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Invalid Request',
        'Invalid credentials or request'
      );
    }
    if (!body.superAdmin) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Superadmin for the body donot exists, cannot update member image',
        ''
      );
    }
    if (!body.superAdmin.equals(req.payload)) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        400,
        'Not Authorized',
        'Only users of superadmin status are allowed to update members image'
      );
    }
    if (req.file !== undefined) {
      req.body.imgUrl = req.file.path;
    }
    if (req.body.imgUrl !== undefined) {
      if (bodyMember.imgUrl.startsWith('media/')) {
        fs.unlinkSync(bodyMember.imgUrl);
      }
    }
    bodyMember.imgUrl = req.body.imgUrl;
    await bodyMember.save();
    res.send(createResponse('Member Updated Succesfully', bodyMember));
  } catch (error) {
    next(error);
  }
};
