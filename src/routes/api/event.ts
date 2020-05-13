import * as express from 'express';
import {Request, Response} from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  toggleStar,
  addUpdate,
  deleteEvent,
  removeUpdate,
  putUpdateEvent,
} from '../../controllers/event';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/check', auth.required, (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log(req.payload);
  return res.send('Successful');
});

//? Tested OK...
//* Add An Event
router.post('/', auth.required, createEvent);

//? Tested OK...
//* Get All The Events
router.get('/', auth.required, getEvents);

//? Tested OK...
//* Get An Event
router.get('/:id', auth.required, getEvent);

//? Tested OK...
//* Delete An Event
router.delete('/:id', auth.required, deleteEvent);

//? Tested OK...
//* Update An Event
router.put('/:id', auth.required, putUpdateEvent);

//? Tested OK...
//* Star/UnStar An Event
router.post('/:id/star', auth.required, toggleStar);

//? Tested OK...
router.post('/:id/addUpdate', auth.required, addUpdate);

//? Tested OK...
router.delete('/:id/removeUpdate', auth.required, removeUpdate);

export default router;
