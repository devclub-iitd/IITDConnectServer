import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import expressValidator from "express-validator";

import eventRouter from "./routes/event";
import userRouter from "./routes/user";

const app = express();

mongoose.Promise = global.Promise;
mongoose
  .connect("", { useNewUrlParser: true })
  .then(() => {
    console.log("Connect To MongoDB");
  })
  .catch(err => {
    console.log("Error Connecting to MongoDB" + err);
  });

app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.get("/", (_req, res) => {
  res.send("Route Page");
});

app.use("/api/events", eventRouter);
app.use("/api/user", userRouter);

export default app;
