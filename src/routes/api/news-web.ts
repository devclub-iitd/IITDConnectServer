import * as express from 'express';
import {getNews, newsDetails} from '../../controllers/news-web';
// import {Request, Response} from 'express';
// import {checkAccessNews} from '../../middleware/checkAccess';
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
router.get('/', getNews);

// ?Tested Ok
// get news details
router.get('/:id', newsDetails);

export default router;
