import express from "express";
import auth from "../../middleware/auth";
import {
  createEvent,
  getEvents,
  getEvent,
  toggleStar
} from "../../controllers/event";

const router = express.Router();

//* Get All The Events
router.get("/", auth.required, getEvents);

//* Get An Event
router.get("/:id", auth.required, getEvent);

//* Add An Event
router.post("/", auth.required, createEvent);

//* Star/UnStar An Event
router.post("/:id/star", auth.required, toggleStar);

export default router;
