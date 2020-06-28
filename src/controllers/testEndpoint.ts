import {Request, Response, NextFunction} from 'express';
import {createResponse, createError} from '../utils/helpers';

import User from '../models/user';

export const MakeMeSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      throw createError(400, 'User Donot Exists', 'Invalid User Id');
    }
    // User Has been verified Lets make him supersuperAdmin
    user.superSuperAdmin = true;
    await user.save();

    res.send(
      createResponse('SuperSuperadmin made Succesfully', {
        superAdminStatus: user.superSuperAdmin,
      })
    );
  } catch (error) {
    next(error);
  }
};
