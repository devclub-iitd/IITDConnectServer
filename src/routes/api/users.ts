import express from "express";
import { check } from "express-validator/check";
import {
  facebookLogin,
  googleLogin,
  addUserInformation,
  getUser
} from "../../controllers/user";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/users/facebookLogin", facebookLogin);

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

//TODO: Requires Authentication and Respond with Users Auth JSON(Current Logged In User)
router.get("/user", auth.required);

router.get("/users/:id", auth.required, getUser);

export default router;
