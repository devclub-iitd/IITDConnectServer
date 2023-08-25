import * as express from 'express';
import {Request, Response} from 'express';
import {
  addLostItem,
  getLostItems,
  getLostItem,
  deleteLostItem,
  updateLostItem,
  toggleVisibilityOfLostItem,
} from '../../controllers/lostfound';
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
//* Add A Lost Item
router.post('/', auth, upload.single('lostItemImage'), addLostItem);

//? Tested OK...
//* Get All Lost Items
router.get('/', getLostItems);

//? Tested OK...
//* Get A Lost Item
router.get('/:id', getLostItem);

//? Tested OK...
//* Delete A Lost Item
router.post('/:id', auth, deleteLostItem);

//? Tested OK...
//* Update A Lost Item
router.put('/:id', auth, upload.single('lostItemImage'), updateLostItem);

// ?Tested Ok
// Toggle change visibity of News
router.get('/toggle/:id', auth, toggleVisibilityOfLostItem);

export default router;
