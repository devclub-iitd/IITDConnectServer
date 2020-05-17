import * as express from 'express';
import {
  getNews,
  addNews,
  deleteNews,
  updateNews,
  newsDetails,
  reportNews,
} from '../../controllers/news';
import {Request, Response} from 'express';
import auth from '../../middleware/auth';

// endpoints
const router = express.Router();

//  get all the events??
router.get('/news/check', auth.required, (req: Request, res: Response) => {
  console.log(req.payload);
  return res.send('Successful');
});

//? tested Ok
// get all News
router.get('/news', auth.required, getNews);

// ?Tested Ok
// add a news
router.post('/news', auth.required, addNews);

router.delete('/news/:id', auth.required, deleteNews);

// ?Tested Ok
// get news details
router.get('/news/:id', auth.required, newsDetails);

// ?Tested Ok
router.patch('/news/:id', auth.required, updateNews);

// report news
router.post('/news/report/:id', auth.required, reportNews);

export default router;
