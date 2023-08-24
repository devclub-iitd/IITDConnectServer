/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Request, Response, NextFunction} from 'express';
import {createResponse} from '../utils/helpers';
import Event, {EventImpl} from '../models/event';
import {Body} from '../models/body';

const toEventJSON = (event: EventImpl) => {
  if (event.body instanceof Body) {
    const temp = {
      id: event.id,
      name: event.name,
      about: event.about,
      body: {
        name: event.body.name,
        about: event.body.about,
        id: event.body.id,
        isSub: false,
      },
      startDate: event.startDate,
      endDate: event.endDate,
      stared: false,
      image: event.imageLink,
      venue: event.venue,
      updates: event.updates,
    };
    return temp;
  }
  //TODO: Return proper error.
  return null;
};

export const getEvent = async (req: Request, res: Response) => {
  const [event] = await Promise.all([
    Event.findById(req.params.id).populate('body').populate('updates').exec(),
  ]);
  if (event === null) {
    return res.status(400).json({message: 'Error'});
  }
  // console.log(event);
  const respData = {
    event: toEventJSON(event),
  };
  return res.send(respData);
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //!TODO IF WE WANT TO ADD THE OPTION TO FILTER BY CLUB OR YEAR OR ANYTHING
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {};
  if (typeof req.query.body !== 'undefined') {
    query.body = req.query.body;
  }
  return Promise.all([
    Event.find(query)
      // .sort({ endDate: "desc" })
      .populate('body')
      .populate('updates')
      .exec(),
  ])
    .then(([events]) => {
      if (events !== null) {
        const respData = {
          events: events.map(event => toEventJSON(event)),
        };
        return res.send(createResponse('Events Found', respData));
      }
      const respData = {
        events: [],
      };
      return res.send(createResponse('Events Found', respData));
    })
    .catch(e => {
      next(e);
    });
};
