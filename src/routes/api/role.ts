//Routes file of Roles
import * as express from 'express';
import auth from '../../middleware/auth';
import {
  newRole,
  getRole,
  getBodyRoles,
  putUpdateRole,
  deleteRole,
} from '../../controllers/role';

const router = express.Router();

router.post('/', auth, newRole);

router.get('/:id', auth, getRole);

router.get('/body/:id', auth, getBodyRoles);

router.put('/:id', auth, putUpdateRole);

router.delete('/:id', auth, deleteRole);

export default router;
