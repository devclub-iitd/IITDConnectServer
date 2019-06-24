import express from "express";
import { check } from "express-validator/check";
import {
  faceBookLogin,
  googleLogin,
  addUserInformation,
  getUser
} from "../../controllers/user";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/users/facebookLogin", [check("code").exists()], faceBookLogin);

router.post("/users/googleLogin", [check("code").exists()], googleLogin);

router.post(
  "/users/addUserInformation",
  [
    //TODO: Add Regex Search For The Email
    check("email")
      .exists()
      .isEmail()
      .withMessage("Enter A Valid Email Address")
  ],
  addUserInformation
);

//TODO: Requires Authentication and Respond with Users Auth JSON(Current Logged In User)
router.get("/user", auth.required);

router.get("/users/:id", auth.required, getUser);

export default router;
