import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  toggleStar
} from "../../controllers/event";
import auth from "../../middleware/auth";

const router = express.Router();

//* Add An Event
router.post("/", auth.required, createEvent);

//* Get All The Events
router.get("/", auth.required, getEvents);

//* Get An Event
router.get("/:id", auth.required, getEvent);

//* Star/UnStar An Event
router.post("/:id/star", auth.required, toggleStar);

export default router;
