/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import app from "./app";

const server = app.listen(app.get("port"), () => {
  console.log(`App is Running at http://localhost:${app.get("port")}`);
  console.log("  Press CTRL-C to stop\n");
});

export default server;
