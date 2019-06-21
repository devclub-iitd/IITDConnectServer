import Event from "../models/event";
import User from "../models/user";
// import Body from "../models/body";
import { validationResult } from "express-validator/check";
import { Request, Response } from "express";

export const createEvent = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Event Creation Failed",
      errors: errors.array()
    });
  }

  try {
    const user = await User.findById(req.payload.id);
    // const body = await Body.findOne({});
    if (!user) {
      return res.sendStatus(401);
    }
    const newEvent = new Event({ ...req.body.event, createdBy: user });
    await newEvent.save();
    return res.status(200).json({
      message: "Event Created Successfully"
    });
  } catch (error) {
    console.log(error);
    //TODO: Send The Error In A Proper Structure
    return res.status(500).send("Connection Issue");
  }
};

export const getEvent = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return "No Such Event";
    }
    return res.status(200).json({
      message: "Found The Event",
      data: {
        event: {
          name: event.name,
          about: event
        }
      }
    });
  } catch (error) {
    return error;
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  let query = {};
  //* Pagination
  let limit = 20;
  let offset = 0;
  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }
  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  try {
    const events = await Event.find(query)
      .limit(limit)
      .skip(offset)
      .sort({ endDate: "desc" })
      .exec();
    return res.status(200).json({
      message: "All The Events",
      data: events
    });
  } catch (error) {
    return error;
  }
};
