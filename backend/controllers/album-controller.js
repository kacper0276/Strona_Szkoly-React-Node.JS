const dbConnect = require("../helpers/databaseConnection");
const fs = require("fs");
const sharp = require("sharp");
const imageSize = require("image-size");

class albumController {
  async addAlbum(req, res) {
    const name = req.body.name,
      year = req.body.year;
    let namePhoto = "";

    sharp.cache(false);

    if (req.files.length > 1) {
      res.send({ msg: "Tutaj można dodać jedno zdjęcie" });
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync("./build/album/" + req.files[i].filename);
      }
    } else {
      namePhoto = Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
      const imgData = imageSize(req.files[0].path);
      const width = imgData.width;
      const height = imgData.height;
      try {
        await sharp(req.files[0].path)
          .resize(Math.round(width * 0.7), Math.round(height * 0.7))
          .toFormat("jpeg")
          .jpeg({ quality: 100 })
          .toFile(`./build/album/${namePhoto}`);

        fs.unlinkSync("./build/album/" + req.files[0].filename);

        if (name.length == 0 || year.length == 0) {
          res.send({ msg: "Dane nie mogą być puste" });
        } else {
          dbConnect.query(
            "INSERT INTO albums (name, years, mini) VALUES (?, ?, ?)",
            [name, year, namePhoto],
            (err, result) => {
              if (err) throw err;

              res.send({ msg: "Dodano album" });
            }
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  async getAllAlbumsInYear(req, res) {
    const year = req.params.rok;

    dbConnect.query(
      "SELECT * FROM albums WHERE years=?",
      [year],
      (err, result) => {
        if (err) throw err;

        res.send({ albums: result });
      }
    );
  }

  async getAlbumDetails(req, res) {
    const schoolYear = req.params.schoolYearList,
      idAlbum = req.params.id;

    dbConnect.query(
      "SELECT * FROM albums WHERE id=?",
      [idAlbum],
      (err, result) => {
        if (err) throw err;

        res.send({ albumData: result });
      }
    );
  }

  async deleteAlbum(req, res) {
    const id = req.params.id;
    var years = "",
      nameAlbum = "";

    dbConnect.query("SELECT * FROM albums WHERE id=?", [id], (err, result1) => {
      const imgToDeleteSize = result1.length;
      years = result1[0].years;
      nameAlbum = result1[0].name;

      for (let i = 0; i < imgToDeleteSize; i++) {
        fs.unlinkSync(`./build/album/${result1[i].mini}`);
      }

      dbConnect.query(
        "SELECT * FROM photosinalbum WHERE years = ? AND name_album = ?",
        [years, nameAlbum],
        (err, result2) => {
          const imgToDeleteSize = result2.length;

          for (var i = 0; i < imgToDeleteSize; i++) {
            for (let j = 0; j < JSON.parse(result2[i].name_photo).length; j++) {
              fs.unlinkSync(
                `./build/photos/${JSON.parse(result2[i].name_photo)[j]}`
              );
            }
          }
          if (i == imgToDeleteSize) {
            dbConnect.query(
              "DELETE FROM albums WHERE id=?",
              [id],
              (err, result) => {
                dbConnect.query(
                  "DELETE FROM photosinalbum WHERE years = ? AND name_album = ?",
                  [years, nameAlbum],
                  (err, result) => {
                    if (err) throw err;

                    res.send({ msg: "Usunięto" });
                  }
                );
              }
            );
          }
        }
      );
    });
  }

  async editAlbum(req, res) {
    const id = req.params.id;

    const name = req.body.name;
    const schoolYear = req.body.schoolYear;

    if (req.body.image) {
      dbConnect.query(
        "UPDATE albums SET name =?, years=? WHERE id =?",
        [name, schoolYear, id],
        (err, result) => {
          res.send({ msg: "Zmieniono" });
        }
      );
    } else {
      let namePhoto = "";

      sharp.cache(false);

      if (req.files.length > 1) {
        res.send({ msg: "Tutaj można dodać jedno zdjęcie" });
        for (let i = 0; i < req.files.length; i++) {
          fs.unlinkSync("./build/album/" + req.files[i].filename);
        }
      } else {
        namePhoto = Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
        try {
          const imgData = imageSize(req.files[0].path);
          const width = imgData.width;
          const height = imgData.height;
          await sharp(req.files[0].path)
            .resize(Math.round(width * 0.7), Math.round(height * 0.7))
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toFile(`./build/album/${namePhoto}`);

          fs.unlinkSync("./build/album/" + req.files[0].filename);
        } catch (e) {
          console.log(e);
        }
      }

      dbConnect.query(
        "SELECT * FROM albums WHERE id=?",
        [id],
        (err, result) => {
          fs.unlinkSync(`./build/album/${result[0].mini}`);
          dbConnect.query(
            "UPDATE `albums` SET name=?, mini=?, years=? WHERE id=?",
            [name, namePhoto, schoolYear, id],
            (err, result) => {
              if (err) throw err;

              res.send({ msg: "Dodano rok szkolny" });
            }
          );
        }
      );
    }
  }
}

module.exports = new albumController();
