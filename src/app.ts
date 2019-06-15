import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import { MONGODB_URI } from "./utils/secrets";

import eventRouter from "./routes/event";
import userRouter from "./routes/users";

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get("/", (_req, res) => {
  res.send("Route Page");
});

app.use("/api/events", eventRouter);
app.use("/api/users", userRouter);

export default app;
