const dbConnect = require("../helpers/databaseConnection");
const fs = require("fs");
const sharp = require("sharp");
const imageSize = require("image-size");

class yearController {
  async addYear(req, res) {
    const years = req.body.name;
    let namePhoto = "";

    sharp.cache(false);

    if (req.files.length > 1) {
      res.send({ msg: "Tutaj można dodać jedno zdjęcie" });
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync("./build/schoolYear/" + req.files[i].filename);
      }
    } else {
      if (years.includes("-")) {
        namePhoto = Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
        try {
          const imgData = imageSize(req.files[0].path);
          const width = imgData.width;
          const height = imgData.height;
          await sharp(req.files[0].path)
            .resize(Math.round(width * 0.7), Math.round(height * 0.7))
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toFile(`./build/schoolYear/${namePhoto}`);

          fs.unlinkSync("./build/schoolYear/" + req.files[0].filename);
        } catch (e) {
          console.log(e);
        }
      }
    }

    years.includes("-")
      ? dbConnect.query(
          "INSERT INTO years (rok_szkolny, photo) VALUES (?, ?)",
          [years, namePhoto],
          (err, result) => {
            if (err) throw err;

            res.send({ msg: "Dodano rok szkolny" });
          }
        )
      : res.send({ msg: "Błąd, błędne dane" });
  }

  async getAllYears(req, res) {
    dbConnect.query(
      "SELECT * FROM years ORDER BY rok_szkolny ASC",
      (err, result) => {
        if (err) throw err;

        res.send({ years: result });
      }
    );
  }

  async deleteYear(req, res) {
    const id = req.params.id;

    // Usuwanie starych zdjęć
    dbConnect.query("SELECT * FROM years WHERE id = ?", [id], (err, result) => {
      const imgToDelete = result[0].photo;
      fs.unlinkSync(`./build/schoolYear/${imgToDelete}`);
      dbConnect.query(
        "SELECT * FROM years WHERE id = ?",
        [id],
        (err, result) => {
          const schoolYear = result[0].rok_szkolny;
          dbConnect.query(
            "SELECT * FROM albums WHERE years=?",
            [schoolYear],
            (err, result1) => {
              const imgToDeleteSize = result1.length;

              for (let i = 0; i < imgToDeleteSize; i++) {
                fs.unlinkSync(`./build/album/${result1[i].mini}`);
              }

              dbConnect.query(
                "SELECT * FROM photosinalbum WHERE years = ?",
                [schoolYear],
                (err, result2) => {
                  const imgToDeleteSize = result2.length;

                  for (var i = 0; i < imgToDeleteSize; i++) {
                    for (
                      let j = 0;
                      j < JSON.parse(result2[i].name_photo).length;
                      j++
                    ) {
                      fs.unlinkSync(
                        `./build/photos/${JSON.parse(result2[i].name_photo)[j]}`
                      );
                    }
                  }
                  if (i == imgToDeleteSize) {
                    dbConnect.query(
                      "DELETE FROM years WHERE id = ?",
                      [id],
                      (err, result) => {
                        dbConnect.query(
                          "DELETE FROM albums WHERE years=?",
                          [schoolYear],
                          (err, result) => {
                            dbConnect.query(
                              "DELETE FROM photosinalbum WHERE years = ?",
                              [schoolYear],
                              (err, result) => {
                                if (err) throw err;

                                res.send({ msg: "Usunięto" });
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                }
              );
            }
          );
        }
      );
    });
  }

  async getMiniImgToDelete(req, res) {
    const id = req.params.id;

    dbConnect.query("SELECT * FROM years WHERE id=?", [id], (err, result) => {
      if (err) throw err;

      res.send({ dataMiniImg: result });
    });
  }

  async updateYear(req, res) {
    const id = req.params.id;
    const name = req.body.name;

    if (req.body.image) {
      dbConnect.query(
        "UPDATE years SET rok_szkolny =? WHERE id =?",
        [name, id],
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
          fs.unlinkSync("./build/schoolYear/" + req.files[i].filename);
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
            .toFile(`./build/schoolYear/${namePhoto}`);

          fs.unlinkSync("./build/schoolYear/" + req.files[0].filename);
        } catch (e) {
          console.log(e);
        }
      }

      name.includes("-")
        ? dbConnect.query(
            "SELECT * FROM years WHERE id=?",
            [id],
            (err, result) => {
              fs.unlinkSync(`./build/schoolYear/${result[0].photo}`);
              dbConnect.query(
                "UPDATE `years` SET rok_szkolny=?, photo=? WHERE id=?",
                [name, namePhoto, id],
                (err, result) => {
                  if (err) throw err;

                  res.send({ msg: "Dodano rok szkolny" });
                }
              );
            }
          )
        : res.send({ msg: "Błąd, błędne dane" });
    }
  }
}

module.exports = new yearController();
