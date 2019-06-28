import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import cors from "cors";
import lusca from "lusca";
import compression from "compression";
import { MONGODB_URI } from "./utils/secrets";

// import logRequest from "./middleware/logRequest";

import routes from "./routes";

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).catch(
  (): void => {
    process.exit();
  }
);
mongoose.set("useCreateIndex", true);

app.set("port", process.env.PORT || 5000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    methods: "GET,PUT,DELETE,POST"
  })
);
app.use(
  lusca({
    xframe: "SAMEORIGIN",
    xssProtection: true
  })
);
app.use(expressValidator());
// app.use(logRequest);

//* Takes Care of All The Routing
app.use(routes);

app.use(
  (_req: Request, _res: Response, next: NextFunction): void => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  }
);

// will print stacktrace
if (process.env.NODE_ENV !== "production") {
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
      res.status(500);
      res.json({
        errors: {
          message: err.message,
          error: err
        }
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
        error: {}
      }
    });
  }
);

export default app;
