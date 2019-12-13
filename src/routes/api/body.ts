import express from "express";
import auth from "../../middleware/auth";
import {
  getAllBodies,
  getBody,
  toggleSubscribe,
  addBody
} from "../../controllers/body";

const router = express.Router();

//? Tested OK
router.get("/", auth.required, getAllBodies);

//? Tested OK
router.post("/", auth.required, addBody);

//? Tested OK
router.get("/:id", auth.required, getBody);

//? Tested OK
//! Google Firebase Integration is Left
router.post("/:id/subscribe", auth.required, toggleSubscribe);

export default router;
