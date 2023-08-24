import * as express from 'express';
import {getAllBodies, getBody} from '../../controllers/body-web';
// import {checkAccessBody} from '../../middleware/checkAccess';

const router = express.Router();

//? Tested OK
router.get('/', getAllBodies);

//? Tested OK
router.get('/:id', getBody);

export default router;
