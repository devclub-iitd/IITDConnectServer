/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
import {createResponse, createError} from '../utils/helpers';
import {Body, BodyImpl} from '../models/body';
// import {nextTick} from 'process';
// import {logger} from '../middleware/logger';

const toBodyJSON = (body: BodyImpl) => {
  return {
    body,
    isSub: false,
  };
};

export const getAllBodies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const filterVal = (req.query.q):
    let bodies;
    if (req.query.q) {
      bodies = await Body.find({typeOfBody: parseInt(req.query.q.toString())});
    } else {
      bodies = await Body.find({});
    }
    const respData = await bodies.map(body => toBodyJSON(body));
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
    const [body] = await Promise.all([Body.findById(req.params.id)]);

    if (body === null) {
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
