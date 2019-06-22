import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import cors from "cors";
import lusca from "lusca";
import compression from "compression";
import { MONGODB_URI } from "./utils/secrets";
// import { CustomError } from "./types/custom";

import routes from "./routes";

require("./utils/secrets");

const app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("Connect To MongoDB");
  })
  .catch(err => {
    console.log("Error Connecting to MongoDB" + err);
  });
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

//* Takes Care of All The Routing
app.use(routes);

// app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
//   res.status(err.status || 500);
//   let e = new Error(err.message);
//   e.name = err.name;
//   res.send(e);
// });

export default app;
