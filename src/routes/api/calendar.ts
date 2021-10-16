import * as express from 'express';
import {
  setReminder,
  getReminder,
  updateReminder,
  deleteReminder,
  getAllEventsAndReminder,
} from '../../controllers/calendar';
import auth from '../../middleware/auth';

const router = express.Router();

// just checking
router.get('/calendar/check', auth, (req, res) => {
  res.send('Heloow boys');
});

// Set customized Reminder
// Tested? Ok
router.post('/calendar/reminder', auth, setReminder);
// TestedOk
// Get all reminders
router.get('/calendar/reminder', auth, getReminder);

// ?Tested Ok
// Update a Reminder
router.put('/calendar/reminder/:id', auth, updateReminder);

// Tested Ok ?
//delete Reminder
router.post('/calendar/reminder/:id', auth, deleteReminder);

router.post('/calendar/all', auth, getAllEventsAndReminder);
export default router;
