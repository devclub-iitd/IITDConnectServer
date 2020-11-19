import * as express from 'express';
import auth from '../../middleware/auth';
const router = express.Router();

// Make a User SuperAdmin
// Development Purpose
import {MakeMeSuperAdmin} from '../../controllers/testEndpoint';
router.get('/makeMeSuperSuperAdmin', auth, MakeMeSuperAdmin);

export default router;
