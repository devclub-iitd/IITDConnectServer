// import modules
import * as express from 'express';

import {getNews} from '../../controllers/news';

const router = express.Router();
import auth from '../../middleware/auth';

// endpoints

//  get all the events??
router.get('/news', auth.required, getNews);

// router.post('/news', auth.required, (_req: Request, _res: Response) => {});

// router.delete('/news', auth.required, (req, res) => {});
