import * as express from 'express';
import auth from '../../middleware/auth';
import {
  getAllBodies,
  getBody,
  toggleSubscribe,
  addBody,
  addMembers,
  updateBody,
  updateMember,
  addMemberImage,
  updateMemberImage,
} from '../../controllers/body';
import {upload} from '../../middleware/multer';
// import {checkAccessBody} from '../../middleware/checkAccess';

const router = express.Router();

//? Tested OK
router.get('/', auth, getAllBodies);

//? Tested OK
router.post('/', auth, upload.single('bodyImage'), addBody);

//? Tested OK
router.get('/:id', auth, getBody);

router.put('/:id', auth, upload.single('bodyImage'), updateBody);

//? Tested OK
//! Google Firebase Integration is Left
router.post('/:id/subscribe', auth, toggleSubscribe);

// ?Tested Ok
// Add members to the Body , Only by Superadmin
router.post('/addMember', auth, addMembers);

router.post(
  '/addMemberImage',
  auth,
  upload.single('bodyMemberImage'),
  addMemberImage
);

router.put('/updateMember', auth, updateMember);

router.post(
  '/updateMemberImage',
  auth,
  upload.single('bodyMemberImage'),
  updateMemberImage
);

export default router;
