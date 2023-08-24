import * as express from 'express';
import {getEvents, getEvent} from '../../controllers/event-web';
// import {checkAccessEvent} from '../../middleware/checkAccess';

const router = express.Router();
//? Tested OK...
//* Get All The Events
router.get('/', getEvents);

//* Get An Event
router.get('/:id', getEvent);

export default router;
