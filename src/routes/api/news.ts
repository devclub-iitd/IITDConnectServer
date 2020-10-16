import * as express from 'express';
import {
  getNews,
  addNews,
  deleteNews,
  updateNews,
  newsDetails,
  reportNews,
  toggleVisibilityOfNews,
  getReportedNews,
} from '../../controllers/news';
// import {Request, Response} from 'express';
import auth from '../../middleware/auth';

// endpoints
const router = express.Router();

// //  Just checking??
// router.get('/news/check', auth, (req: Request, res: Response) => {
//   console.log(req.payload);
//   return res.send('Successful');
// });

//? tested Ok
// get all News
// /news/?sortBy=createdAt:desc
// news/?limit=10&skip=15
router.get('/news', auth, getNews);

// ?Tested Ok
// add a news
router.post('/news', auth, addNews);

router.delete('/news/:id', auth, deleteNews);

// ?Tested Ok
// get news details
router.get('/news/:id', auth, newsDetails);

// ?Tested Ok
router.patch('/news/:id', auth, updateNews);

// report news
router.post('/news/report/:id', auth, reportNews);

// ?Tested Ok
// Toggle change visibity of News
router.get('/news/report/toggle/:id', auth, toggleVisibilityOfNews);

// Get all Reported News
router.get('/news/report/all', auth, getReportedNews);
export default router;
