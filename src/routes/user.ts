import express from "express";
import { check } from "express-validator/check";
import { signUp } from "../controllers/user";
const router = express.Router();

router.post(
  "/user",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not a Valid Email Address")
  ],
  signUp
);

export default router;
