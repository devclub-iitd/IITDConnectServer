import * as express from 'express';
import {allMapData} from '../../controllers/maps';
const router = express.Router();

// Not required any Authentication
router.get('/all', allMapData);
export default router;
