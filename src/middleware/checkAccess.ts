import {Request, Response, NextFunction} from 'express';
import {Body} from '../models/body';
import User from '../models/user';
import {createError} from '../utils/helpers';

// export const checkAccess = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = await User.findById(req.payload);
//     //For now checking isAdmin, later will change it to adminof()
//     if (
//       user === null ||
//       (user.superSuperAdmin === false && user.isAdmin === false)
//     ) {
//       throw createError(401, 'Unauthorized', 'InvalidCheck');
//     } else {
//       return next();
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({
//       msg: 'Access Denied...',
//     });
//   }
// };

export const checkAccessEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    const requestBody = req.body;
    const body = await Body.findById(requestBody.body);
    //For now checking isAdmin, later will change it to adminof()
    if (
      user === null ||
      body === null ||
      (user.superSuperAdmin === false &&
        user.isAdmin === false &&
        user.isSuperAdmin === false)
    ) {
      throw createError(401, 'Unauthorized', 'InvalidCheck');
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Access Denied...',
    });
  }
};

export const checkAccessBody = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null || user.superSuperAdmin === false) {
      throw createError(401, 'Unauthorized', 'InvalidCheck');
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Access Denied...',
    });
  }
};

export const checkAccessNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Invalid', 'Invalid Login Credentials');
    } else if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to add news'
      );
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: 'Access Denied...',
    });
  }
};
