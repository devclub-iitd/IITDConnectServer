/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
// import {validationResult} from 'express-validator/check';
// import * as jwt from 'jsonwebtoken';
// import * as bcrypt from 'bcryptjs';
// import * as uuid from 'uuid/v5';
// import * as nodemailer from 'nodemailer';
// import {JWT_SECRET} from '../utils/secrets';
import User from '../models/user';
import {Body} from '../models/body';
import {createError, createResponse} from '../utils/helpers';

// export const addUserInformation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({errors: errors.array()});
//     }
//     const {email, department, entryNumber} = req.body;
//     const user = await User.findOne({
//       $or: [{iitdEmail: email}, {entryNumber: entryNumber}],
//     });
//     if (user !== null) {
//       throw createError(
//         401,
//         'Invalid Details',
//         'Email or Entry Number Already In Use'
//       );
//     }
//     const hash = uuid(email, uuid.DNS);
//     const updatedUser = await User.findByIdAndUpdate(
//       req.payload.id,
//       {
//         iitdEmail: email,
//         department: department,
//         entryNumber: entryNumber,
//         hash: hash,
//       },
//       {new: true}
//     );
//     if (updatedUser === null) {
//       throw createError(401, 'Unauthorized', 'Invalid Information');
//     }
//     return res
//       .status(200)
//       .json({message: 'We Have Sent An Email For Confirmation'});
//   } catch (error) {
//     return next(error);
//   }
// };

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.params.id)
    .populate('adminOf')
    .populate('superAdminOf')
    .exec()
    .then(user => {
      if (user === null) {
        throw createError(401, 'Unauthorized', 'No Such User Found');
      }
      return res.send(createResponse('User Found', user));
    })
    .catch(e => {
      next(e);
    });
};

export const postMakeSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {clubId, userEmail} = req.body;
    const [admin, user, body] = await Promise.all([
      User.findById(req.payload.id),
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (body !== null && user !== null && admin !== null) {
      if (admin.superSuperAdmin === true) {
        body.superAdmin = user._id;
        user.superAdminOf.push(body.id);
        await Promise.all([user.save(), body.save()]);
      } else {
        throw createError(
          404,
          'Authorization',
          'Only superSuper Admin can perform This action'
        );
      }
    } else {
      throw createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }
    res.send(
      createResponse('Success', {
        body: body,
        superAdmin: user,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const postMakeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {clubId, userEmail} = req.body;
    const [user, body] = await Promise.all([
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (user !== null && body !== null) {
      if (body.superAdmin.equals(req.payload.id)) {
        user.adminOf.push(body.id);
        body.admins.push(user.id);
        await Promise.all([user.save(), body.save()]);
      } else {
        throw createError(
          404,
          'Authorization',
          'Require SuperAdmin status for the club'
        );
      }
    } else {
      throw createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }

    res.send(
      createResponse('Admin Added Succesfully', {
        bodyId: body.id,
        userId: user.id,
      })
    );
  } catch (error) {
    return next(error);
  }
};

export const getListOfAdmins = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {clubId} = req.body;
  // return res.send(clubId);
  Body.findById(clubId)

    .then(body => {
      // console.log(body);
      if (body !== null) {
        const admins = body.admins;
        return res.send(
          createResponse('Success', {
            admins: admins,
          })
        );
      }
      return res.send(createError(404, 'Invalid', 'Invalid Club Id'));
    })
    .catch(err => {
      next(err);
    });
};

export const removeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {userEmail, clubId} = req.body;
    const [user, body] = await Promise.all([
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (user !== null && body !== null) {
      if (body.superAdmin.equals(req.payload.id)) {
        const indexOne = body.admins.indexOf(user.id);
        const indexTwo = user.adminOf.indexOf(body.id);
        if (indexOne !== -1) {
          body.admins.splice(indexOne, 1);
        }
        if (indexTwo !== -1) {
          user.adminOf.splice(indexTwo, 1);
        }
        await user.save();
        await body.save();
      } else {
        throw createError(
          404,
          'Authorization',
          'Not Authorized To Perform this Action. Require SuperAdmin Status'
        );
      }
    } else {
      throw createError(
        404,
        'Invalid Credentials',
        'Not Authorized To Perform this Action. User id or body id Invalid'
      );
    }
    return res.send(createResponse('Successfully Deleted The Admin', {}));
  } catch (error) {
    return next(error);
  }
};

// export const signUp = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({errors: errors.array()});
//     }
//     const {name, email, password} = req.body;
//     const user = await User.findOne({email});
//     if (user !== null) {
//       throw createError(401, 'Invalid Request', 'Email ID Is Already In Use');
//     }
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const newUser = await new User({name, email, password: hashedPassword});
//     await newUser.save();
//     return res.json({message: 'Registration Successful'});
//   } catch (error) {
//     return next(error);
//   }
// };

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({errors: errors.array()});
//     }
//     const {email, password} = req.body;
//     // console.log(req.payload);
//     const user = await User.findOne({email: email});
//     if (user === null) {
//       throw createError(401, 'Invalid Request', 'No Such User Exists');
//     }
//     const isMatch = bcrypt.compareSync(password, user.password);
//     if (!isMatch) {
//       throw createError(401, 'Invalid Request', 'Invalid Login Credentials');
//     }
//     const payload = {
//       id: user._id,
//     };
//     const token = jwt.sign(payload, JWT_SECRET, {
//       expiresIn: '7d',
//     });
//     const respData = {
//       token,
//     };
//     return res.send(createResponse('Login Successful', respData));
//   } catch (error) {
//     return next(error);
//   }
// };

export const getUserDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  User.findById(req.payload.id)
    .populate('adminOf')
    .populate('superAdminOf')
    .exec()
    .then(user => {
      if (user === null) {
        throw createError(401, 'Unauthorized', 'No Such User Found');
      }
      return res.send(createResponse('User Found', user));
    })
    .catch(e => {
      next(e);
    });
};
