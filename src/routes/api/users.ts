/* eslint-disable no-console */
import express from "express";
import { check } from "express-validator/check";
import {
  // facebookLogin,
  // googleLogin,
  addUserInformation,
  getUser,
  postMakeAdmin,
  getListOfAdmins,
  removeAdmin,
  signUp,
  login,
  postMakeSuperAdmin
} from "../../controllers/user";
import auth from "../../middleware/auth";

const router = express.Router();

// router.post("/users/facebookLogin", facebookLogin);

// router.post("/users/googleLogin", (_, res: Response) => {
//   console.log("HELLO WORLD");
//   return res.send("Tumkiiiiiii");
// });

// router.post("/users/googleLogin", googleLogin);

router.post(
  "/users/addUserInformation",
  [
    //TODO: Add Regex Search For The Email
    check("email")
      .exists()
      .isEmail()
      .withMessage("Enter A Valid Email Address")
  ],
  auth.required,
  addUserInformation
);

//  name,email,superadmin,
//TODO: Requires Authentication and Respond with Users Auth JSON(Current Logged In User)
router.get("/user", auth.required);

//? Tested OK...
router.post("/users/getAdmins", auth.required, getListOfAdmins);

//? Tested OK...
router.post("/users/addAdmin", auth.required, postMakeAdmin);

//? Tested OK...
router.post("/users/addSuperAdmin", auth.required, postMakeSuperAdmin);

//? Tested OK...
router.get("/users/:id", auth.required, getUser);

router.post("/users/removeAdmin", auth.required, removeAdmin);

//? Tested OK...
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not a Valid Email Address")
  ],
  signUp
);

//? Tested OK...
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not a Valid Email Address")
  ],
  login
);

export default router;
