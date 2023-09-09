const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./build/photos/");
  },
  filename: function (req, file, cb) {
    const name = `${Date.now()}${Math.ceil(
      Math.random() * 10000
    )}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

module.exports = upload;
