//Controllers File for Roles
import {Request, Response, NextFunction} from 'express';
// import { Body } from '../models/body';
// import {Types} from 'mongoose';
import {Role} from '../models/role';
import User from '../models/user';
import {createResponse, createError} from '../utils/helpers';

export const newRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const newRole = new Role({
      ...req.body,
      addedBy: user,
    });

    await newRole.save();
    res.send(createResponse('Role Created Successfully', {newRole}));
  } catch (error) {
    next(error);
  }
};

export const getRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const role = await Role.findById(req.params.id);
    if (role === null) {
      throw createError(400, 'Error ', 'Invalid Role');
    }
    const respData = role;
    res.send(createResponse('Role Found', respData));
  } catch (error) {
    next(error);
  }
};

export const getBodyRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    // const body = await Body.findById(req.params.id);
    const roles = await Role.find();
    roles.filter(role => {
      let bodies = role.access;
      bodies = bodies.filter(bodyId => {
        return bodyId.toString() === req.params.id.toString();
      });
      return bodies.length > 0;
    });
    if (roles === null) {
      throw createError(400, 'Error ', 'Invalid Role');
    }
    const respData = roles;
    res.send(createResponse('Roles Found', respData));
  } catch (error) {
    next(error);
  }
};

export const putUpdateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid');
    }
    const role = await Role.findById(req.params.id);
    if (role === null) {
      throw createError(400, 'Error ', 'Invalid Role');
    }
    // verify allowed fields
    const allowedUpdates = ['roleName', 'policies', 'access', 'accessGlobal'];
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
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body);
    res.send(createResponse('Event Updated Succesfully', updatedRole));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await Role.findById(req.params.id);
    if (role === null) {
      throw createError(400, 'Invalid', 'Role Id Invalid');
    }
    // TODO Remove the role from the Body and the users
    // await Body.update({_id: event.body}, {$pull: {events: event.id}});
    await role.remove();
    res.send(createResponse('Role Was Successfully Removed', 'Role Removed'));
  } catch (error) {
    next(error);
  }
};

// const userHasPerm = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
//   policyNum: Number
// ) => {

// };
