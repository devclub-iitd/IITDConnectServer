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
router.get('/calendar/check', auth.required, (req, res) => {
  res.send('Heloow boys');
});

// Set customized Reminder
// Tested? Ok
router.post('/calendar/reminder', auth.required, setReminder);
// TestedOk
// Get all reminders
router.get('/calendar/reminder', auth.required, getReminder);

// ?Tested Ok
// Update a Reminder
router.patch('/calendar/reminder/:id', auth.required, updateReminder);

// Tested Ok ?
//delete Reminder
router.delete('/calendar/reminder/:id', auth.required, deleteReminder);

router.post('/calendar/all', auth.required, getAllEventsAndReminder);
export default router;
