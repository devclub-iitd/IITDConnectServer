import express from "express";
import auth from "../../middleware/auth";
import { createEvent, getAllEvents, getEvent } from "../../controllers/event";

const router = express.Router();

//* Get All The Events
router.get("/", auth.required, getAllEvents);

//* Get An Event
router.get("/:id", auth.required, getEvent);

//* Add An Event
router.post("/", auth.required, createEvent);

//* Delete An Event
router.delete("/:id", auth.required);

//* Edit An Event
router.put(":id", auth.required);

router.post("/:id/star", auth.required);

export default router;
