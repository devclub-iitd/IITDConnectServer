import * as multer from 'multer';

// const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({
  //dest: 'uploads/',
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
});
