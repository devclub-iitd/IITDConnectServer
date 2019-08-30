import express from "express";

import userRouter from "./users";
import eventRouter from "./event";
import bodyRouter from "./body";

const router = express.Router();

router.use("/", userRouter);
router.use("/events", eventRouter);
router.use("/body", bodyRouter);

export default router;
