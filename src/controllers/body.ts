/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {createResponse, createError} from '../utils/helpers';

import User, {UserImpl} from '../models/user';
import {Body, BodyMember, BodyImpl} from '../models/body';
import * as admin from 'firebase-admin';
// import {nextTick} from 'process';

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
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const newBody = new Body(req.body);
    if (req.file !== undefined) {
      newBody.imageUrl = req.file.path;
    }
    await newBody.save();
    res.send(createResponse('Body Created Successfully', newBody));
  } catch (error) {
    next(error);
  }
};

// const newBody = new Body(req.body);
// newBody
//   .save()
//   .then(body => {
//     const respData = {
//       body: {
//         name: body.name,
//       },
//     };
//     return res.send(createResponse('Body Created Successfully', respData));
//   })
//   .catch(err => {
//     next(err);
//   });

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
// return Promise.all([User.findById(req.payload), Body.find()])
//   .then(([user, bodies]) => {
//     if (user === null || bodies === null) {
//       return null;
//     }
//     return res.status(200).json({
//       bodies: bodies.map(body => toBodyJSON(body, user)),
//     });
//   })
//   .catch(err => next(err));

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
    const [superadmin, body] = await Promise.all([
      User.findById(req.payload),
      Body.findById(req.params.id),
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
        'Superadmin for the body donot exists, cannot add members. First create superAdmin',
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
    await body.update(req.body);
    await body.save();
    res.send(createResponse('Sucess', req.body));
  } catch (error) {
    next(error);
  }
};
export const toggleSubscribe = async (
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
    const index = user.subscribedBodies.indexOf(
      new Types.ObjectId(req.params.id)
    );
    if (index === -1) {
      //subscibe
      if (process.env.NODE_ENV === 'production') {
        // Subscribe user to Firebase topic of the current body
        if (body) {
          await admin
            .messaging()
            .subscribeToTopic(user.fcmRegistrationToken, body.name);
          console.log(`${user.name} subscribed to topic ${body.name}`);
        }
      }
      user.subscribedBodies.push(new Types.ObjectId(req.params.id));
    } else {
      //unsubscribe
      if (process.env.NODE_ENV === 'production') {
        // Subscribe user to Firebase topic of the current body
        if (body) {
          await admin
            .messaging()
            .unsubscribeFromTopic(user.fcmRegistrationToken, body.name);
          console.log(`${user.name} unsubscribed to topic ${body.name}`);
        }
      }
      user.subscribedBodies.splice(index, 1);
    }

    if (process.env.NODE_ENV === 'production') {
      // Subscribe user to Firebase topic of the current body
      const body = await Body.findById(req.params.id);
      if (body) {
        await admin
          .messaging()
          .subscribeToTopic(user.fcmRegistrationToken, body.name);
        console.log(`${user.name} subscribed to topic ${body.name}`);
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
    // console.log('here 1');
    // console.log(body.superAdmin, req.payload);
    if (!body.superAdmin.equals(req.payload)) {
      throw createError(
        400,
        'Not Authorized',
        'Only users of superadmin status are allowed to add The members'
      );
    }
    const member = new BodyMember(req.body.member);
    if (body.members.includes(member)) {
      throw createError(
        400,
        'Already Exists',
        'The given member already exists'
      );
    }
    body.members.push(member);
    await body.save();

    res.send(createResponse('Sucess', member));
  } catch (error) {
    next(error);
  }
};
