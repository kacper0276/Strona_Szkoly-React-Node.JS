const connection = require("../helpers/databaseConnection.js");
const sharp = require("sharp");
const fs = require("fs");

class footerController {
  async addFooter(req, res) {
    sharp.cache(false);

    const name = Date.now() + ".jpeg";

    const name2 = "./build/partners/" + name;

    const nameOldFile = req.files[0].filename;

    const alt = req.body.alt,
      odnosnik = req.body.odnosnik;

    try {
      await sharp(req.files[0].path)
        .resize(90, 50)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(name2);

      fs.unlinkSync("./build/originalPhoto/" + nameOldFile);
    } catch (e) {
      console.log(e);
    }

    connection.execute(
      "INSERT INTO `footer`(`path`, `alt`, `link`) VALUES (?, ?, ?);",
      [name, alt, odnosnik],
      (err, result) => {
        if (err) throw err;

        res.send({ msg: "Dodano firmę do stopki" });
      }
    );
  }

  async allFooter(req, res) {
    connection.query("SELECT * FROM `footer` GROUP BY id", (err, result) => {
      if (err) throw err;

      res.send({ data: result });
    });
  }

  async deleteFooter(req, res) {
    const id = req.params.id;
    let zdj1 = "";

    connection.execute(
      "SELECT * FROM footer WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        zdj1 = `${result[0].path}`;

        if (zdj1 != "") {
          try {
            fs.unlinkSync("build/partners/" + zdj1);
          } catch (e) {
            console.log(e);
          }
        }

        connection.query(
          "DELETE FROM `footer` WHERE id = ?",
          [id],
          (err, result) => {
            if (err) throw err;

            res.send({ msg: "Usunięto" });
          }
        );
      }
    );
  }

  async showEditFormFooter(req, res) {
    const id = req.params.id;

    connection.query(
      "SELECT * FROM `footer` WHERE id = ?",
      [id],
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        res.send({ data: result });
      }
    );
  }

  async editFooter(req, res) {
    const id = req.params.id;

    let oldPhoto = "";

    connection.query(
      "SELECT * FROM footer WHERE id = ?",
      [id],
      (err, result) => {
        oldPhoto = `${result[0].path}`;

        if (zdj1 != "") {
          try {
            fs.unlinkSync(oldPhoto);
          } catch (e) {
            console.log(e);
          }
        }
      }
    );

    const alt = req.body.alt,
      odnosnik = req.body.odnosnik;

    sharp.cache(false);

    const namePhoto1 = Date.now() + ".jpeg";

    const namePhoto1Long = "public/partners/" + namePhoto1;

    const nameOldPhoto = req.files.image[0].filename;

    try {
      await sharp(req.files.image[0].path)
        .resize(90, 50)
        .toFormat("jpeg")
        .jpeg({ quality: 100 })
        .toFile(namePhoto1Long);

      fs.unlinkSync("public/originalPhoto/" + nameOldPhoto);
    } catch (e) {
      console.log(e);
    }

    connection.execute(
      "UPDATE `footer` SET `path`= ?,`alt`= ?,`link`= ? WHERE id = ?",
      [name2, alt, odnosnik, id],
      (err, result) => {
        if (err) throw err;

        res.redirect("/admin");
      }
    );
  }
}

module.exports = new footerController();
