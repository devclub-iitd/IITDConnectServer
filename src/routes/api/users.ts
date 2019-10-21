/* eslint-disable no-console */
import express, { Response } from "express";
import { check } from "express-validator/check";
import {
  facebookLogin,
  googleLogin,
  addUserInformation,
  getUser,
  postMakeAdmin,
  getListOfAdmins,
  removeAdmin
} from "../../controllers/user";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/users/facebookLogin", facebookLogin);

// router.post("/users/googleLogin", (_, res: Response) => {
//   console.log("HELLO WORLD");
//   return res.send("Tumkiiiiiii");
// });

router.post("/users/googleLogin", googleLogin);

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

router.get("/users/:id", auth.required, getUser);

router.post("/users/addAdmin", auth.required, postMakeAdmin);

router.post("/users/getAdmins", auth.required, getListOfAdmins);

router.post("/users/removeAdmin", auth.required, removeAdmin);

export default router;
