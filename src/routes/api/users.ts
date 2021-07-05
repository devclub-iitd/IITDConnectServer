/* eslint-disable no-console */
import * as express from 'express';
// import {check} from 'express-validator/check';
import {
  // facebookLogin,
  // googleLogin,
  // addUserInformation,
  // getUser,
  postMakeAdmin,
  getListOfAdmins,
  removeAdmin,
  // signUp,
  // login,
  postMakeSuperAdmin,
  loggedInUserDetails,
  updateSuperAdmin,
} from '../../controllers/user';
import auth from '../../middleware/auth';

const router = express.Router();

// router.post("/users/facebookLogin", facebookLogin);

// router.post("/users/googleLogin", (_, res: Response) => {
//   console.log("HELLO WORLD");
//   return res.send("Tumkiiiiiii");
// });

// router.post("/users/googleLogin", googleLogin);

// router.post(
//   '/users/addUserInformation',
//   [
//     //TODO: Add Regex Search For The Email
//     check('email')
//       .exists()
//       .isEmail()
//       .withMessage('Enter A Valid Email Address'),
//   ],
//   auth,
//   addUserInformation
// );

//? Tested OK...
router.get('/user/me', auth, loggedInUserDetails);

//? Tested OK...
router.post('/users/getAdmins', auth, getListOfAdmins);

//? Tested OK...
router.post('/users/addAdmin', auth, postMakeAdmin);

//? Tested OK...
router.post('/users/addSuperAdmin', auth, postMakeSuperAdmin);

//? Tested OK...
// router.get('/users/:id', auth, getUser);

//? Tested OK...
router.post('/users/removeAdmin', auth, removeAdmin);

router.patch('/users/updatesuperadmin', auth, updateSuperAdmin);

//? Tested OK...
// router.post(
//   '/signup',
//   [check('email').isEmail().exists().withMessage('Not a Valid Email Address')],
//   signUp
// );

//? Tested OK...
// router.post(
//   '/login',
//   [check('email').isEmail().exists().withMessage('Not a Valid Email Address')],
//   login
// );

export default router;
