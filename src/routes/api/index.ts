import * as express from 'express';

import userRouter from './users';
import eventRouter from './event';
import bodyRouter from './body';
import newsRouter from './news';
import calendarRouter from './calendar';
// import testEndpoints from './testEndpoint';
const router = express.Router();

router.use('/', userRouter);
router.use('/events', eventRouter);
router.use('/body', bodyRouter);
router.use('/', newsRouter);
router.use('/', calendarRouter);
// router.use('/testEndpoint', testEndpoints);
export default router;
