import * as express from 'express';
import {Request, Response, NextFunction} from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as expressValidator from 'express-validator';
import * as cors from 'cors';
import * as lusca from 'lusca';
import * as compression from 'compression';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import {MONGODB_URI} from './utils/secrets';

import routes from './routes';
const serviceAccount = JSON.parse(
  fs.readFileSync('src/serviceAccountKey.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iitd-connect-b0113.firebaseio.com',
});

// import logRequest from "./middleware/logRequest";

const app = express();

// mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true}).catch((): void => {
  throw new Error('Cannot Connect To MongoDB');
});
mongoose.set('useCreateIndex', true);

app.set('port', process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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
// app.use(logRequest);

//* Takes Care of All The Routing
app.use(routes);

app.use((_req: Request, _res: Response, next: NextFunction): void => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (process.env.NODE_ENV !== 'production') {
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
      res.status(500);
      res.json({
        errors: {
          message: err.message,
          error: err,
        },
      });
    }
  );
}

app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    res.status(500);
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  }
);

export default app;
