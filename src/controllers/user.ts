import { Request, Response } from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { validationResult } from "express-validator/check";
import User from "../models/user";

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
