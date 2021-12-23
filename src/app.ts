import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as cors from 'cors';
import * as lusca from 'lusca';
import * as compression from 'compression';
import * as admin from 'firebase-admin';

// import logRequest from './middleware/logRequest';
import * as cron from 'node-cron';
import {trendUpdate} from './cronJobs/trendUpdate';
import routes from './routes';
import {MONGODB_URI} from './utils/secrets';
const morgan = require('morgan');
const cluster = require('cluster');
import {logger} from './middleware/logger';

// Firebase Admin Configuration
// eslint-disable-next-line node/no-unpublished-import
import * as serviceAccountKey from './serviceAccountKey.json';

if (process.env.NODE_ENV === 'production') {
  const serviceAccount = serviceAccountKey as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://iitd-connect-c6554.firebaseio.com',
  });
}
// import logRequest from "./middleware/logRequest";

const app = express();

mongoose.connect(MONGODB_URI || '').catch((err: Error): void => {
  if (err) {
    logger.error(err || '');
  }
  throw new Error('Cannot Connect To MongoDB');
});

app.set('port', process.env.PORT || 5000);

// #########################
// MIDDLEWARES

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  cors({
    origin: true,
    methods: 'GET,PUT,DELETE,POST',
  })
);
app.use(
  lusca({
    xframe: 'SAMEORIGIN',
    xssProtection: true,
  })
);

app.use(expressValidator());
// Logg incoming connections
if (process.env.NODE_ENV === 'production') app.use(morgan('default'));

// END of MIDDLEWARES
// #######################

// ###########
// TEST for firebase notification
const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};
app.post('/firebase/notification', async (req: Request, res: Response) => {
  try {
    logger.debug('here');
    const registrationToken = req.body.registrationToken;
    const message = req.body.message;
    const options = notification_options;

    await admin.messaging().sendToDevice(registrationToken, message, options);

    res.status(200).send('Notification sent successfully');
  } catch (error) {
    logger.error(error);
    res.send(error);
  }
});
app.post(
  '/firebase/notification/subscribe',
  async (req: Request, res: Response) => {
    try {
      logger.debug('here');
      const registrationToken = req.body.registrationToken;
      const topic = req.body.topic;

      await admin.messaging().subscribeToTopic(registrationToken, topic);

      res.status(200).send('Subscribed Successfully');
    } catch (error) {
      logger.error(error);
      res.send(error);
    }
  }
);

// ##################################
// Endpoints-Registered
// #################################

// LOGS Endpoint
app.get(
  '/api/logs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendFile('combined.log', {root: './'});
    } catch (error) {
      next(error);
    }
  }
);

//* Takes Care of All The Routing
app.use(routes);

// Endpoint not found
// If no url matches then return 404 not fouund .
app.use((_req: Request, _res: Response, next: NextFunction): void => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// ## Found error in Endpoints
// If there occurs in the controllers above the error is taken to here.
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err.status) {
      res.status(err.status);
    } else {
      res.status(500);
    }

    // Print the error logs in logger outputs as well
    logger.error(err);
    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  }
);

if (cluster.isMaster) {
  // Schedule cron-Jobs
  cron.schedule('0 */30 * * * *', trendUpdate);
}
export default app;
