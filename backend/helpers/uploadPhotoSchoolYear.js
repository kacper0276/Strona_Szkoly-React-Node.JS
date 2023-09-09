const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./build/schoolYear");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  },
});
const uploadYear = multer({ storage });

module.exports = uploadYear;
