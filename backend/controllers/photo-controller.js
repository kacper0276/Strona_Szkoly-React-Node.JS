const sharp = require("sharp");
const dbConnect = require("../helpers/databaseConnection");
const fs = require("fs");
const imageSize = require("image-size");

class photoController {
  async addPhotos(req, res) {
    async function uploadImg(image) {
      const name = Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
      namesPhoto.push(name);
      try {
        const imgData = imageSize(image.path);
        const width = imgData.width;
        const height = imgData.height;
        await sharp(image.path)
          .resize(Math.round(width * 0.4), Math.round(height * 0.4))
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`./build/photos/${name}`);

        fs.unlinkSync("./build/photos/" + image.filename);
      } catch (e) {
        console.log(e);
      }
    }

    const year = req.body.year,
      album = req.body.album;
    var namesPhoto = [];

    sharp.cache(false);

    req.files.forEach((image) => {
      uploadImg(image);
    });

    dbConnect.query(
      "INSERT INTO `photosinalbum`(`years`, `name_album`, `name_photo`) VALUES (?, ?, ?)",
      [year, album, JSON.stringify(namesPhoto)],
      (err, result) => {
        if (err) throw err;

        res.send({ msg: "Dodano zdjęcia" });
      }
    );
  }

  async getPhotosInAlbum(req, res) {
    const { year, name } = req.params;

    dbConnect.query(
      "SELECT name_photo FROM photosinalbum WHERE years=? AND name_album=?",
      [year, name],
      (err, result) => {
        if (err) throw err;

        res.send({ photos: result });
      }
    );
  }

  async deleteImage(req, res) {
    const photoName = req.params.imgname;

    dbConnect.query(
      `SELECT * FROM photosinalbum WHERE name_photo LIKE '%${photoName}%'`,
      (err, result) => {
        if (err) throw err;

        const photos = JSON.parse(result[0].name_photo);

        const resultImg = JSON.stringify(
          photos.filter((word) => word != photoName)
        );

        dbConnect.query(
          `UPDATE photosinalbum SET name_photo='${resultImg}' WHERE name_photo LIKE '%${photoName}%'`,
          (err, result) => {
            if (err) throw err;

            fs.unlinkSync(`./build/photos/${photoName}`);

            res.send({ msg: "Usunięto IMG" });
          }
        );
      }
    );
  }

  async editImage(req, res) {
    async function uploadImg(image) {
      const name = Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
      namesPhoto.push(name);
      try {
        const imgData = imageSize(image.path);
        const width = imgData.width;
        const height = imgData.height;
        await sharp(image.path)
          .resize(Math.round(width * 0.7), Math.round(height * 0.7))
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`./build/photos/${name}`);

        fs.unlinkSync("./build/photos/" + image.filename);
      } catch (e) {
        console.log(e);
      }
    }

    const name = req.body.name,
      schoolYear = req.body.schoolYear;
    let namesPhoto = [];

    sharp.cache(false);

    req.files.forEach((image) => {
      uploadImg(image);
    });

    dbConnect.query(
      "SELECT * FROM photosinalbum WHERE years=? AND name_album=?",
      [schoolYear, name],
      (err, result) => {
        if (err) throw err;

        const photos = JSON.parse(result[0].name_photo);

        const photosArray = [...photos, ...namesPhoto];

        dbConnect.query(
          "UPDATE photosinalbum SET name_photo=? WHERE years=? AND name_album=?",
          [JSON.stringify(photosArray), schoolYear, name],
          (err, result) => {
            if (err) throw err;

            res.send({ msg: "Zaktualizowano zdjęcia" });
          }
        );
      }
    );
  }
}

module.exports = new photoController();
