import express, { Request, Response } from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  toggleStar,
  addUpdate,
  deleteEvent
} from "../../controllers/event";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/check", auth.required, (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log(req.payload);
  return res.send("Successful");
});

//* Add An Event
router.post("/", auth.required, createEvent);

//* Get All The Events
router.get("/", auth.required, getEvents);

//* Get An Event
router.get("/:id", auth.required, getEvent);

//* Delete An Event
router.delete("/:id", auth.required, deleteEvent);

//* Star/UnStar An Event
router.post("/:id/star", auth.required, toggleStar);

router.post("/:id/addUpdate", auth.required, addUpdate);

export default router;
