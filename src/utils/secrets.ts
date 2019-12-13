import dotenv from "dotenv";
import fs from "fs";
// import path from "path";

if (fs.existsSync("src/.env")) {
  dotenv.config({ path: "src/.env" });
}

export const FACEBOOK_CLIENTID = process.env.FACEBOOK_CLIENTID;
export const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;

// export const GOOGLE_CLIENT_ID =
//   process.env.GOOGLE_CLIENTID ||
//   "205021812271-u4ig83ckb55gamgg4t26ctifsvvds9bi.apps.googleusercontent.com";

export const GOOGLE_CLIENT_ID =
  "205021812271-k4np4uhlk9b0u8rtfr57na5rm82qcbbe.apps.googleusercontent.com";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://saksham:saksham5@ds343887.mlab.com:43887/iitd-connect";
