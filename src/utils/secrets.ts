import dotenv from "dotenv";
import fs from "fs";
// import path from "path";

if (fs.existsSync("src/.env")) {
  console.log("Found The File");
  dotenv.config({ path: "src/.env" });
} else {
  console.log("No Such File Exists");
}

export const FACEBOOK_CLIENTID =
  process.env.FACEBOOK_CLIENTID || "430839157468333";
export const FACEBOOK_SECRET =
  process.env.FACEBOOK_SECRET || "fff3a85d075fcc209dde18d19fa4fe1c";

export const GOOGLE_CLIENT_ID = "";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://saksham:saksham5@ds012188.mlab.com:12188/iitd-connect";
