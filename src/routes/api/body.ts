import * as express from 'express';
import auth from '../../middleware/auth';
import {
  getAllBodies,
  getBody,
  toggleSubscribe,
  addBody,
  addMembers,
  updateBody,
} from '../../controllers/body';

const router = express.Router();

//? Tested OK
router.get('/', auth.required, getAllBodies);

//? Tested OK
router.post('/', auth.required, addBody);

//? Tested OK
router.get('/:id', auth.required, getBody);

router.patch('/:id', auth.required, updateBody);

//? Tested OK
//! Google Firebase Integration is Left
router.post('/:id/subscribe', auth.required, toggleSubscribe);

// ?Tested Ok
// Add members to the Body , Only by Superadmin
router.post('/addMember', auth.required, addMembers);
export default router;
