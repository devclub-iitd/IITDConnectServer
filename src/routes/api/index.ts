import * as express from 'express';

import userRouter from './users';
import eventRouter from './event';
import eventRouterWeb from './event-web';
import bodyRouter from './body';
import bodyRouterWeb from './body-web';
import lostFoundRouter from './lostfound';
import newsRouter from './news';
import newsRouterWeb from './news-web';
import calendarRouter from './calendar';
import mapsrouter from './maps';
// import testEndpoints from './testEndpoint';
const router = express.Router();

router.use('/', userRouter);
router.use('/events', eventRouter);
router.use('/web/events', eventRouterWeb);
router.use('/body', bodyRouter);
router.use('/web/body', bodyRouterWeb);
router.use('/lostfound', lostFoundRouter);
router.use('/', newsRouter);
router.use('/web/news', newsRouterWeb);
router.use('/', calendarRouter);
router.use('/maps', mapsrouter);
// router.use('/testEndpoint', testEndpoints);
export default router;
