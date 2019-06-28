import express from "express";
import auth from "../../middleware/auth";
import { getAllBodies, getBody, toggleSubscribe } from "../../controllers/body";

const router = express.Router();

router.get("/", auth.required, getAllBodies);

router.get("/:id", auth.required, getBody);

router.post("/:id/subscribe", auth.required, toggleSubscribe);

export default router;
