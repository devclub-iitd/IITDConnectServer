import {Request, Response, NextFunction} from 'express';
import User from '../models/user';
import {Body} from '../models/body';
import {createError, createResponse} from '../utils/helpers';
import {SSA_PSWD} from '../utils/secrets';
import {logger} from '../middleware/logger';
import * as admin from 'firebase-admin';

// import {UserRefreshClient} from 'google-auth-library';
// import bodyParser = require('body-parser');

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
//       req.payload,
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

// export const getUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   User.findById(req.params.id)
//     .populate('adminOf')
//     .populate('superAdminOf')
//     .exec()
//     .then(user => {
//       if (user === null) {
//         throw createError(401, 'Unauthorized', 'No Such User Found');
//       }
//       return res.send(createResponse('User Found', user));
//     })
//     .catch(e => {
//       next(e);
//     });
// };

export const postMakeSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {clubId, userEmail} = req.body;
    const [admin, user, body] = await Promise.all([
      User.findById(req.payload),
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (body !== null && user !== null && admin !== null) {
      if (admin.superSuperAdmin === true) {
        body.superAdmin = user._id;
        user.superAdminOf.push(body.id);
        user.isSuperAdmin = true;
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

export const updateSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {clubId, userEmail} = req.body;
    const user_next = await User.findOne({email: userEmail});
    const body = await Body.findById(clubId);
    const admin = await User.findById(req.payload);

    if (body !== null && user_next !== null && admin !== null) {
      if (body.superAdmin.equals(user_next.id)) {
        res.send(createResponse('Sucess', {}));
      } else {
        if (admin.superSuperAdmin === true) {
          const user_prev = await User.findById(body.superAdmin);

          if (user_prev !== null) {
            const index = user_prev.superAdminOf.indexOf(body.id);
            if (index !== -1) {
              user_prev.superAdminOf.splice(index, 1);
            }
            if (user_prev.superAdminOf.length === 0)
              user_prev.isSuperAdmin = false;
          }
          body.superAdmin = user_next.id;
          user_next.superAdminOf.push(body.id);
          user_next.isSuperAdmin = true;
          await user_next.save();
          await body.save();
          await user_prev?.save();
        } else {
          throw createError(
            404,
            'Authorization',
            'Only superSuper Admin can perform This action'
          );
        }
      }
    } else {
      throw createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }
    res.send(createResponse('Success ', {}));
  } catch (e) {
    return next(e);
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
      if (body.superAdmin.equals(req.payload)) {
        user.adminOf.push(body.id);
        body.admins.push(user.id);
        user.isAdmin = true;
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

export const getListOfAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (!user) {
      //res.status(401).send({message: 'Authentication Failed'});
      throw createError(401, 'Unauthorized', 'Invalid Credentials');
    }

    // return res.send(clubId);
    const body = await Body.findById(req.body.clubId);

    if (!body) {
      throw createError(401, 'Body Not found', 'Body not found , Wrong id');
    } else {
      if (!body.admins) {
        throw createError(400, 'No Admins', ' Body doesnot have any admins');
      } else {
        const admins = await User.find(
          {_id: {$in: body.admins}},
          {name: 1, email: 1}
        );
        res.send(createResponse('Admins', {admins: admins}));
      }
    }
  } catch (err) {
    next(err);
  }
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
      if (body.superAdmin.equals(req.payload)) {
        const indexOne = body.admins.indexOf(user.id);
        const indexTwo = user.adminOf.indexOf(body.id);
        if (indexOne !== -1) {
          body.admins.splice(indexOne, 1);
        }
        if (indexTwo !== -1) {
          user.adminOf.splice(indexTwo, 1);
        }
        if (user.adminOf.length === 0) user.isAdmin = false;
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

export const loggedInUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload)
      .populate('adminOf')
      .populate('superAdminOf');

    if (user === null) {
      throw createError(401, 'Unauthorized', 'No Such User Found');
    }
    res.send(createResponse('User Found', user));
  } catch (e) {
    next(e);
  }
};

export const updatefcm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (!user) {
      throw createError(401, 'Unauthorized', 'Invalid Credentials');
    }
    const update = Object.keys(req.body);
    if (!update.includes('fcmRegistrationToken') || update.length !== 1) {
      throw createError(400, 'Error', 'Update field does not match');
    }
    if (process.env.NODE_ENV === 'production') {
      if (user.fcmRegistrationToken) {
        //for loop
        for (let i = 0; i < user.subscribedBodies.length; i++) {
          //get bpdy
          const body = await Body.findById(user.subscribedBodies[i]);
          if (body !== null) {
            await admin
              .messaging()
              .unsubscribeFromTopic(user.fcmRegistrationToken, body.name);
            logger.info(`${user.name} unsubscribed to topic ${body.name}`);

            await admin
              .messaging()
              .subscribeToTopic(req.body.fcmRegistrationToken, body.name);
            logger.info(`${user.name} subscribed to topic ${body.name}`);
          }
        }
      }
    }
    await User.findByIdAndUpdate(req.payload, req.body);

    res.send(
      createResponse('Success', 'fcmRegistrationToken Updated Succesfully')
    );
  } catch (error) {
    next(error);
  }
};

export const toggleMakeSuperSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email} = req.body;
    const user = await User.findOne({email: email});

    if (user !== null && req.body.password === SSA_PSWD) {
      user.superSuperAdmin = !user.superSuperAdmin;
    } else {
      throw createError(
        404,
        'Authorization Failed ',
        'User doesnot exists or Invalid password'
      );
    }

    await user.save();
    res.send(
      createResponse('Status SuperSuper admin  toggled Succesfully', {
        userId: user.id,
        supersuperadmin: user.superSuperAdmin,
      })
    );
  } catch (error) {
    return next(error);
  }
};
