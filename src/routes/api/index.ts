import express, { Request, Response, NextFunction } from "express";
import userRouter from "./users";
import eventRouter from "./event";
const router = express.Router();

router.use("/", userRouter);
router.use("/events", eventRouter);

export default router;
