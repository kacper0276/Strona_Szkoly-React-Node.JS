const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./build/album/");
  },
  filename: function (req, file, cb) {
    const name = Date.now() + path.extname(file.originalname);
    cb(null, name);
  },
});
const uploadAlbum = multer({ storage });

module.exports = uploadAlbum;
