import express from "express";
import { check } from "express-validator/check";
import { signUp } from "../controllers/user";
const router = express.Router();

router.post(
  "/",
  [
    check("email")
      .isEmail()
      .exists()
      .withMessage("Not a Valid Email Address")
  ],
  signUp
);

router.post("/login", []);

export default router;
