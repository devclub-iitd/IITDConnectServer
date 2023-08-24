import * as express from 'express';
import auth from '../../middleware/auth';
import {getAllBodies, getBody} from '../../controllers/body-web';
// import {checkAccessBody} from '../../middleware/checkAccess';

const router = express.Router();

//? Tested OK
router.get('/', auth, getAllBodies);

//? Tested OK
router.get('/:id', auth, getBody);

export default router;
