import * as express from 'express';
import {Request, Response} from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  getStarredEvents,
  toggleStar,
  addUpdate,
  deleteEvent,
  removeUpdate,
  putUpdateEvent,
} from '../../controllers/event';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/check', auth, (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log(req.payload);
  return res.send('Successful');
});

//? Tested OK...
//* Add An Event
router.post('/', auth, createEvent);

//? Tested OK...
//* Get All The Events
router.get('/', auth, getEvents);

router.get('/starred', auth, getStarredEvents);
//? Tested OK...
//* Get An Event
router.get('/:id', auth, getEvent);

//? Tested OK...
//* Delete An Event
router.delete('/:id', auth, deleteEvent);

//? Tested OK...
//* Update An Event
router.put('/:id', auth, putUpdateEvent);

//? Tested OK...
//* Star/UnStar An Event
router.post('/:id/star', auth, toggleStar);

//? Tested OK...
router.post('/:id/addUpdate', auth, addUpdate);

//? Tested OK...
router.delete('/:id/removeUpdate', auth, removeUpdate);

export default router;
