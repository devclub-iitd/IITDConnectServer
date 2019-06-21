import express from "express";
import { check } from "express-validator/check";
import { signUp, login } from "../../controllers/user";
import auth from "../../middleware/auth";
const router = express.Router();

//* Register A User
router.post(
  "/users",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not a Valid Email Address")
  ],
  signUp
);

//* Login For A User
router.post(
  "/users/login",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not A Valid Email Address")
  ],
  login
);

//TODO: Requires Authentication and Respond with Users Auth JSON
router.get("/user", auth.required);

//TODO: Requires Authentication and Updates The Users Information
router.put("/user", auth.required);

export default router;
