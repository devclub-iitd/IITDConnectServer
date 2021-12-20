import * as multer from 'multer';

// const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:|\./g, '') + '-' + file.originalname
    );
  },
});
export const upload = multer({
  //dest: 'uploads/',
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
