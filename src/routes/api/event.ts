import * as express from 'express';
import {Request, Response} from 'express';
import {
  createEvent,
  getEvents,
  getEvent,
  getStarredEvents,
  toggleStarEvent,
  addUpdate,
  deleteEvent,
  removeUpdate,
  putUpdateEvent,
  toggleSubscribeEventNotifications,
} from '../../controllers/event';
import auth from '../../middleware/auth';
import {upload} from '../../middleware/multer';
// import {checkAccessEvent} from '../../middleware/checkAccess';

const router = express.Router();

router.get('/check', auth, (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log(req.payload);
  return res.send('Successful');
});

//? Tested OK...
//* Add An Event
router.post(
  '/',
  auth,
  // checkAccessEvent,
  upload.single('eventImage'),
  createEvent
);

//? Tested OK...
//* Get All The Events
router.get('/', auth, getEvents);

router.get('/starred', auth, getStarredEvents);
//? Tested OK...
//* Get An Event
router.get('/:id', auth, getEvent);

//? Tested OK...
//* Delete An Event
router.post('/:id', auth, deleteEvent);

//? Tested OK...
//* Update An Event
router.put('/:id', auth, upload.single('eventImage'), putUpdateEvent);

//? Tested OK...
//* Star/UnStar An Event
router.post('/:id/star', auth, toggleStarEvent);

//? Tested OK...
router.post('/:id/addUpdate', auth, addUpdate);

//? Tested OK...
router.post('/:id/removeUpdate', auth, removeUpdate);

// Toggle subscribe starred events Notifs
router.post(
  '/toggle-subscribe-event-notification',
  auth,
  toggleSubscribeEventNotifications
);
export default router;
