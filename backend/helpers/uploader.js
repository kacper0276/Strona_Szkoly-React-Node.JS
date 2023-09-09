const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./build/originalPhoto");
  },
  filename: function (req, file, cb) {
    const name =
      Date.now() +
      Math.floor(Math.random() * 100) +
      path.extname(file.originalname);
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});

module.exports = upload;
