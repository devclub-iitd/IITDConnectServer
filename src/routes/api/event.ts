import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  toggleStar,
  addUpdate
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

router.post("/:id/addUpdate", auth.required, addUpdate);

export default router;
