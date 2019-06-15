import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// var id = crypto.randomBytes(20).toString('hex');
import { validationResult } from "express-validator/check";
import User from "../models/user";
// import VerificationToken from "../models/verificationToken";

export const signUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    let user = User.findOne({ $or: [{ email: email }] });
    if (user) {
      return res.status(420).send("Username or Email Is Already In Use");
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    //TODO: Return The Jwt Token To The Frontend
    return res.json({
      message: "Registration Successful"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Connection Issue");
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //TODO: Add Error Handling
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "invalid login details" }] });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "invalid login details" }] });
    }
    //TODO: Return The Jwt Token To The Frontend
  } catch (error) {
    console.log(error);
    return res.status(500).send("Connection Issue");
  }
  return null;
};
