import LostItem from '../models/lostfound';
import User from '../models/user';
import {Request, Response, NextFunction} from 'express';
import {createError, createResponse} from '../utils/helpers';
import fs = require('fs');
import {logger} from '../middleware/logger';

export const getLostItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.query);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // interface LooseObject {
    //   [key: string]: number;
    // }
    const sort: {[k: string]: number} = {};
    // const sort: LooseObject = {};
    if (req.query.sortBy !== undefined) {
      const parts = req.query.sortBy.toString().split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    // console.log(sort);
    const limit =
      req.query.limit !== undefined ? parseInt(req.query.limit.toString()) : 20;

    const skip =
      req.query.skip !== undefined ? parseInt(req.query.skip.toString()) : 0;

    const lostItems = await LostItem.find(
      {visible: true},
      {
        name: 1,
        description: 1,
        imgUrl: 1,
        place: 1,
        status: 1,
        createdAt: 1,
      },
      {
        limit: limit,
        skip: skip,
        sort,
      }
    );
    res.send(lostItems);
  } catch (e) {
    return next(e);
  }
};
export const getLostItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const user = await User.findById(req.payload);
    // if (!user) {
    //   //res.status(401).send({message: 'Authentication Failed'});
    //   throw createError(401, 'Unauthorized', 'Invalid Credentials');
    // }
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem || lostItem.visible === false) {
      throw createError(
        401,
        'Doesnot Exists',
        'lostItem for given id does not exists or is not visible'
      );
    }
    res.send(lostItem);
  } catch (error) {
    return next(error);
  }
};
export const addLostItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(401, 'Invalid', 'Invalid Login Credentials');
    }
    if (!user.isSuperAdmin && !user.superSuperAdmin) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to add lostItem only SA and SSA can add lostItem'
      );
    }
    const lostItem = new LostItem({
      ...req.body,
      createdBy: user._id,
    });
    if (req.file !== undefined) {
      lostItem.imgUrl = req.file.path;
    }
    await lostItem.save();

    // Logging outputs
    logger.info(
      'Lost Item created successfully , Name ->' +
        lostItem.name +
        'By user ->' +
        user.name
    );
    res.send(createResponse('LostItem added Successfully', lostItem));
  } catch (err) {
    next(err);
  }
};

export const deleteLostItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Invalid', 'Invalid Login credentials');
    }
    if (!user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to delete lostItem'
      );
    }

    //Superadmins can delete only their news
    const lostItem = await LostItem.findById(req.params.id);
    if (
      lostItem !== null &&
      lostItem.imgUrl !== undefined &&
      lostItem.imgUrl.startsWith('media/')
    ) {
      fs.unlinkSync(lostItem.imgUrl);
    }
    await LostItem.findByIdAndDelete(req.params.id);
    res.send(createResponse('LostItem deleted Successfully', {}));
  } catch (error) {
    next(error);
  }
};

export const updateLostItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify user
    const user = await User.findById(req.payload);
    const oldLostItem = await LostItem.findById(req.params.id);
    if (user === null) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(401, 'Invalid', 'Invalid Login credentials');
    }
    if (!user.isSuperAdmin && !user.superSuperAdmin) {
      if (req.file !== undefined) {
        fs.unlinkSync(req.file.path);
      }
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to update lostItem'
      );
    }

    // verify allowed fields
    const allowedUpdates = [
      'name',
      'description',
      'imgUrl',
      'place',
      'visible',
      'status',
      'createdAt',
    ];
    if (req.file !== undefined) {
      req.body.imgUrl = req.file.path;
    }
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
    // Finally updating
    if (req.body.imgUrl !== undefined) {
      if (
        oldLostItem !== null &&
        oldLostItem.imgUrl !== undefined &&
        oldLostItem.imgUrl.startsWith('media/')
      ) {
        fs.unlinkSync(oldLostItem.imgUrl);
      }
    }
    await LostItem.findByIdAndUpdate(req.params.id, req.body);
    const updatedLostItem = await LostItem.findById(req.params.id);
    res.send(createResponse('News Updated Succesfully', updatedLostItem));
  } catch (err) {
    next(err);
  }
};

export const toggleVisibilityOfLostItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid Login credentials');
    }
    if (!user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to toggleOffVisibility of lostItem'
      );
    }
    //SuperAdmins can toggle OFF ONLY their own news
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem) {
      throw createError(400, 'field doesnt exist', 'News donot exists');
    }

    lostItem.visible = !lostItem.visible;
    await lostItem.save();
    res.send(createResponse('successfull', {visibleStatus: lostItem.visible}));
  } catch (error) {
    next(error);
  }
};
