/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator/check';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid/v5';
// import * as nodemailer from 'nodemailer';
import {JWT_SECRET} from '../utils/secrets';
import User from '../models/user';
import Body from '../models/body';
import {createError, createResponse} from '../utils/helpers';

//TODO: Configire A Real SMTP Server
// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//     user: 'benjamin.kertzmann75@ethereal.email',
//     pass: 'Wh8YJTbFNvn67bknMr',
//   },
// });

//! Receive The Code From The Frontend

export const addUserInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {email, department, entryNumber} = req.body;
    const user = await User.findOne({
      $or: [{iitdEmail: email}, {entryNumber: entryNumber}],
    });
    if (user !== null) {
      throw createError(
        401,
        'Invalid Details',
        'Email or Entry Number Already In Use'
      );
    }
    const hash = uuid(email, uuid.DNS);
    const updatedUser = await User.findByIdAndUpdate(
      req.payload.id,
      {
        iitdEmail: email,
        department: department,
        entryNumber: entryNumber,
        hash: hash,
      },
      {new: true}
    );
    if (updatedUser === null) {
      throw createError(401, 'Unauthorized', 'Invalid Information');
    }
    return res
      .status(200)
      .json({message: 'We Have Sent An Email For Confirmation'});
  } catch (error) {
    return next(error);
  }
};

// export const addUserInformation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({errors: errors.array()});
//   }
//   const {email, department, entryNumber} = req.body;
//   const user = await User.findOne({
//     $or: [{iitdEmail: email}, {entryNumber: entryNumber}],
//   });
//   if (user) {
//     throw createError(
//       401,
//       'Invalid Details',
//       'Email or Entry Number Already In Use'
//     );
//   }
//   const hash = uuid(email, uuid.DNS);
// User.findByIdAndUpdate(
//   req.payload.id,
//   {
//     iitdEmail: email,
//     department: department,
//     entryNumber: entryNumber,
//     hash: hash,
//   },
//   {new: true}
// )
//     .then(user => {
//       if (!user) {
//         throw createError(401, 'Unauthorized', 'Invalid Information');
//       }
//   //! Send a Confirmation Email
//   const link = `http://${req.get('host')}/user/verify/${hash}`;
//   return transporter.sendMail({
//     from: '"DevClub 👻" <dev@example.com>', // sender address
//     to: `${user.iitdEmail}`, // list of receivers
//     subject: 'Confirm Your Email Address', // Subject line
//     html:
//       'Hello,<br> Please Click on the link to verify your email.<br><a href=' +
//       link +
//       '>Click here to verify</a>',
//   });
// })
// .then(() => {
//   return res
//     .status(200)
//     .json({message: 'We Have Sent An Email For Confirmation'});
// })
//     .catch(err => next(err));
// };

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hash: string = req.params.hash;
  User.findOneAndUpdate({hash: hash}, {emailValidated: true}, {new: true})
    .then(user => {
      if (!user) {
        return null;
      }
      return res.json({message: 'Email Verified Successfully'});
    })
    .catch(err => next(err));
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
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
      }
      return createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }
    return createError(404, 'Invalid', 'Invalid Club or User');
  } catch (error) {
    return next(error);
  }
};

// export const postMakeSuperAdmin = (req: Request, res: Response) => {
//   const {clubId, userEmail} = req.body;
//   return Promise.all([
//     User.findById(req.payload.id),
//     User.findOne({
//       email: userEmail,
//     }),
//     Body.findById(clubId),
//   ])
//     .then(([admin, user, body]) => {
//       if (body !== null && user !== null && admin !== null) {
//         if (admin.superSuperAdmin === true) {
//           body.superAdmin = user._id;
//           user.superAdminOf.push(body.id);
//           return Promise.all([user.save(), body.save()]);
//         } else {
//           res.send(
//             createError(
//               404,
//               'Authorization',
//               'Not Authorized To Perform this Action'
//             )
//           );
//         }
//       } else {
//         res.send(createError(404, 'Invalid', 'Invalid Club or User'));
//       }
//     })
//     .then(() => {
//       res.send('Successfully Created The SuperUser');
//     });
// };

export const postMakeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {clubId, userEmail} = req.body;
    const [user, body] = await Promise.all([
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (user !== null && body !== null) {
      if (body.superAdmin === req.payload.id) {
        user.adminOf.push(body.id), body.admins.push(user.id);
        await Promise.all([user.save(), body.save()]);
        return res.send('Successfully Created The Admin');
      }
      return createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }
    return createError(404, 'Invalid', 'Invalid Club or User');
  } catch (error) {
    return next(error);
  }
};

// export const postMakeAdmin = (req: Request, res: Response) => {
//   const {clubId, userEmail} = req.body;
//   return Promise.all([
//     User.findOne({
//       email: userEmail,
//     }),
//     Body.findById(clubId),
//   ])
//     .then(([user, body]) => {
//       if (body !== null && user !== null) {
//         if (body.superAdmin === req.payload.id) {
//           user.adminOf.push(body.id), body.admins.push(user.id);
//           return Promise.all([user.save(), body.save()]);
//         } else {
//           res.send(
//             createError(
//               404,
//               'Authorization',
//               'Not Authorized To Perform this Action'
//             )
//           );
//         }
//       } else {
//         res.send(createError(404, 'Invalid', 'Invalid Club or User'));
//       }
//     })
//     .then(() => {
//       res.send('Successfully Created The Admin');
//     });
// };

export const getListOfAdmins = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {clubId} = req.body;
  // return res.send(clubId);
  Body.findById(clubId)
    .populate('admins')
    .then(body => {
      console.log(body);
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {userEmail, clubId} = req.body;
    const [user, body] = await Promise.all([
      User.findOne({
        email: userEmail,
      }),
      Body.findById(clubId),
    ]);
    if (user !== null && body !== null) {
      if (body.superAdmin === req.payload.id) {
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
        return res.send('Successfully Deleted The Admin');
      }
      throw createError(
        404,
        'Authorization',
        'Not Authorized To Perform this Action'
      );
    }
    return createError(404, 'Invalid', 'Invalid Club or User');
  } catch (error) {
    return next(error);
  }
};

// export const removeAdmin = (req: Request, res: Response) => {
//   const {userEmail, clubId} = req.body;
//   return Promise.all([
//     User.findOne({
//       email: userEmail,
//     }),
//     Body.findById(clubId),
//   ])
//     .then(([user, body]) => {
//       if (body !== null && user !== null) {
//         if (body.superAdmin === req.payload.id) {
//           const indexOne = body.admins.indexOf(user.id);
//           const indexTwo = user.adminOf.indexOf(body.id);
//           if (indexOne !== -1) {
//             body.admins.splice(indexOne, 1);
//           }
//           if (indexTwo !== -1) {
//             user.adminOf.splice(indexTwo, 1);
//           }
//           return Promise.all([user.save(), body.save()]);
//         } else {
//           return res.send(
//             createError(
//               404,
//               'Authorization',
//               'Not Authorized To Perform this Action'
//             )
//           );
//         }
//       } else {
//         return res.send(createError(404, 'Invalid', 'Invalid Club or User'));
//       }
//     })
//     .then(() => {
//       return res.send('Successfully Deleted The Admin');
//     });
// };

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if (user !== null) {
      throw createError(401, 'Invalid Request', 'Email ID Is Already In Use');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await new User({name, email, password: hashedPassword});
    await newUser.save();
    return res.json({message: 'Registration Successful'});
  } catch (error) {
    return next(error);
  }
};

// export const signUp = (req: Request, res: Response) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log('Wrong');
//     return res.status(400).json({errors: errors.array()});
//   }

//   const {name, email, password} = req.body;
//   // let user = User.findOne({ $or: [{ email: email }] });
//   User.findOne({
//     email: email,
//   }).then(user => {
//     if (user !== null) {
//       console.log(user);
//       console.log('Already');
//       return res.status(420).send('Username or Email Is Already In Use');
//     }
//     const hashedPassword = bcrypt.hashSync(password, 10);
//     const newUser = new User({name, email, password: hashedPassword});
//     newUser
//       .save()
//       .then(() => {
//         return res.json({
//           message: 'Registration Successful',
//         });
//       })
//       .catch(err => {
//         console.log(err);
//         return res.status(500).send('Connection Issue');
//       });
//   });
// };

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }
    const {password} = req.body;
    const user = await User.findById(req.payload.id);
    if (user === null) {
      throw createError(401, 'Invalid Request', 'No Such User Exists');
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw createError(401, 'Invalid Request', 'Invalid Login Credentials');
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });
    const respData = {
      token,
    };
    return res.send(createResponse('Login Successful', respData));
  } catch (error) {
    return next(error);
  }
};

// export const login = (req: Request, res: Response) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({errors: errors.array()});
//   }
//   const {email, password} = req.body;
//   User.findOne({email: email})
//     .then(user => {
//       if (user === null) {
//         return res.status(400).json({errors: [{msg: 'invalid login details'}]});
//       }
//       const isMatch = bcrypt.compareSync(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({errors: [{msg: 'invalid login details'}]});
//       }
//       const payload = {
//         id: user._id,
//       };
//       const token = jwt.sign(payload, JWT_SECRET, {
//         expiresIn: '7d',
//       });
//       const respData = {
//         token,
//       };
//       return res.send(createResponse('Login Successful', respData));
//     })
//     .catch(err => {
//       console.log(err);
//       return res.status(500).send('Connection Issue');
//     });
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
