const { log } = require("console");
const connection = require("../helpers/databaseConnection.js");
const fs = require("fs");
const sharp = require("sharp");
const imageSize = require("image-size");

class articleController {
  async sendBuildings(req, res) {
    connection.query(
      "SELECT name, which FROM `buildings` WHERE type='poziom1' ",
      (err, result) => {
        if (err) throw err;

        res.send({ buildings: result });
      }
    );
  }

  async addArticle(req, res) {
    const alt = req.body.alt,
      title = req.body.title,
      date = req.body.date,
      type = "jedenimg";

    let name = req.body.buildings,
      shortDes = req.body.short,
      where = "",
      keyword = req.body.keyword,
      longDes = req.body.long,
      photos = [];

    keyword = keyword.trim().toLowerCase();

    const buildings = name.split(",");

    sharp.cache(false);

    if (req.files.length > 1) {
      res.send({ error: "Za dużo zdjęć, maksymalna ilość zdjęć to: 3" });
      for (let i = 0; i < req.files.length; i++) {
        fs.unlinkSync("./build/originalPhoto/" + req.files[i].filename);
      }
    } else {
      for (let i = 0; i < req.files.length; i++) {
        const namePhoto =
          Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
        photos.push(namePhoto);
        const imgData = imageSize(req.files[i].path);
        const width = imgData.width;
        const height = imgData.height;
        try {
          await sharp(req.files[i].path)
            .resize(Math.round(width * 0.7), Math.round(height * 0.7))
            .toFormat("jpeg")
            .jpeg({ quality: 100 })
            .toFile(`./build/news/${namePhoto}`);

          fs.unlinkSync("./build/originalPhoto/" + req.files[i].filename);
        } catch (e) {
          console.log(e);
        }
      }

      // if (
      //   buildings.includes("Szkoła branżowa I") ||
      //   buildings.includes("Szkoła branżowa II")
      // ) {
      //   where += "szkołabranżowa, ";
      // }

      longDes = longDes.replaceAll("background: white;", "");
      shortDes = shortDes.replaceAll("background: white;", "");

      if (buildings.includes("Szkoła branżowa I")) {
        where += "szkołabranżowa, ";
      }

      if (buildings.includes("Szkoła branżowa II")) {
        where += "szkołabranżowaii, ";
      }

      for (let i = 0; i < buildings.length; i++) {
        if (
          i != buildings.length - 1 &&
          buildings[i].toLowerCase() != "szkoła branżowa i" &&
          buildings[i].toLowerCase() != "szkoła branżowa ii"
        ) {
          where += buildings[i].toLowerCase().replace(/\s+/g, "") + ", ";
        } else {
          if (
            buildings[i].toLowerCase() != "szkoła branżowa i" &&
            buildings[i].toLowerCase() != "szkoła branżowa ii"
          )
            where += buildings[i].toLowerCase().replace(/\s+/g, "");
        }
      }

      let photosToString = photos.join(" ");

      if (req.files.length == 0) {
        photosToString = "noimg.svg";
      }

      // longDes = longDes.replaceAll('href="content', 'href="/content');
      // longDes = longDes.replaceAll('href="files', 'href="/files');
      // longDes = longDes.replaceAll('href="aktualnosci', 'href="/aktualnosci');
      longDes = longDes.replaceAll('href="', 'href="/');
      longDes = longDes.replaceAll('href="/http', 'href="http');
      longDes = longDes.replaceAll('src="', 'src="/');
      shortDes = shortDes.replaceAll('href="', 'href="/');
      shortDes = shortDes.replaceAll('href="/http', 'href="http');
      shortDes = shortDes.replaceAll('src="', 'src="/');

      connection.execute(
        "INSERT INTO `artykul`(`title`, `shortdes`, `longdes`, `includes`, `alt`, `date`, `img`,`type`, `keyword`, `img1`, `img2`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          shortDes,
          longDes,
          where,
          alt,
          date,
          photosToString,
          type,
          keyword,
          "BRAK",
          "BRAK",
        ],
        (err, result) => {
          res.send({ msg: "Stworzono artykuł", status: result });
        }
      );
    }
  }

  async deleteArticle(req, res) {
    const id = req.params.id;

    connection.execute(
      "SELECT * FROM artykul WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        if (result[0].img.split(" ").length && result[0].img != "noimg.svg") {
          const imgToDeleteSize = result[0].img.split(" ").length;
          const imgToDelete = result[0].img.split(" ");
          for (let i = 0; i < imgToDeleteSize; i++) {
            fs.unlinkSync(`./build/news/${imgToDelete[i]}`);
          }
        }

        connection.query(
          "DELETE FROM `artykul` WHERE id = ?",
          [id],
          (err, result) => {
            if (err) throw err;

            res.send({ message: "Pomyślnie usunięto artykuł" });
          }
        );
      }
    );
  }

  async showAllArticle(req, res) {
    connection.query(
      "SELECT * FROM artykul WHERE id != 262 ORDER BY date DESC",
      (err, result) => {
        if (err) {
          throw err;
        }

        res.send({ data: result });
      }
    );
  }

  async editArticle(req, res) {
    const id = req.params.id,
      type = "jedenimg",
      alt = req.body.alt,
      title = req.body.title,
      date = req.body.date;

    let name = req.body.buildings,
      longDes = req.body.long,
      where = "",
      keyword = req.body.keyword,
      shortDes = req.body.short,
      photos = [];

    keyword.trim().toLowerCase();

    const buildings = name.split(",");

    if (req.files.length > 0) {
      let oldMini;

      // Usuwanie starych zdjęć
      connection.query(
        "SELECT * FROM artykul WHERE id = ?",
        [id],
        (err, result) => {
          if (result[0].img.split(" ").length && result[0].img != "noimg.svg") {
            const imgToDeleteSize = result[0].img.split(" ").length;
            const imgToDelete = result[0].img.split(" ");
            for (let i = 0; i < imgToDeleteSize; i++) {
              fs.unlinkSync(`./build/news/${imgToDelete[i]}`);
            }
          }
        }
      );

      sharp.cache(false);

      // Dodawanie nowych zdjęć

      if (req.files.length > 1) {
        res.send({ error: "Za dużo zdjęć, maksymalna ilość zdjęć to: 1" });
        for (let i = 0; i < req.files.length; i++) {
          fs.unlinkSync("./build/originalPhoto/" + req.files[i].filename);
        }
      } else {
        for (let i = 0; i < req.files.length; i++) {
          const namePhoto =
            Date.now() + Math.floor(Math.random() * 100) + ".jpeg";
          photos.push(namePhoto);
          const imgData = imageSize(req.files[i].path);
          const width = imgData.width;
          const height = imgData.height;
          try {
            await sharp(req.files[i].path)
              .resize(Math.round(width * 0.7), Math.round(height * 0.7))
              .toFormat("jpeg")
              .jpeg({ quality: 100 })
              .toFile(`./build/news/${namePhoto}`);

            fs.unlinkSync("./build/originalPhoto/" + req.files[i].filename);
          } catch (e) {
            console.log(e);
          }
        }

        longDes = longDes.replaceAll("background: white;", "");
        shortDes = shortDes.replaceAll("background: white;", "");

        // if (
        //   buildings.includes("Szkoła branżowa I") ||
        //   buildings.includes("Szkoła branżowa I")
        // ) {
        //   where += "szkołabranżowa, ";
        // }

        if (buildings.includes("szkołabranżowa")) {
          where += "szkołabranżowa, ";
        }

        if (buildings.includes("szkołabranżowaii")) {
          where += "szkołabranżowaii, ";
        }

        for (let i = 0; i < buildings.length; i++) {
          if (
            i != buildings.length - 1 &&
            buildings[i].toLowerCase() != "szkołabranżowa" &&
            buildings[i].toLowerCase() != "szkołabranżowaii"
          ) {
            where += buildings[i].toLowerCase() + ", ";
          } else {
            if (
              buildings[i].toLowerCase() != "szkołabranżowa" &&
              buildings[i].toLowerCase() != "szkołabranżowaii"
            )
              where += buildings[i].toLowerCase();
          }
        }

        const photosToString = photos.join(" ");

        // longDes = longDes.replaceAll('href="content', 'href="/content');
        // longDes = longDes.replaceAll('href="files', 'href="/files');
        // longDes = longDes.replaceAll('href="aktualnosci', 'href="/aktualnosci');
        longDes = longDes.replaceAll('href="', 'href="/');
        longDes = longDes.replaceAll('href="/http', 'href="http');
        longDes = longDes.replaceAll('src="', 'src="/');
        shortDes = shortDes.replaceAll('href="', 'href="/');
        shortDes = shortDes.replaceAll('href="/http', 'href="http');
        shortDes = shortDes.replaceAll('src="', 'src="/');

        connection.execute(
          "UPDATE `artykul` SET `title`= ?,`shortdes`= ?,`longdes`= ?, `includes` = ?, `alt`= ?, `img`=?,  `date`= ?,`type`= ?, `keyword` = ? WHERE id = ?",
          [
            title,
            shortDes,
            longDes,
            where.trim(),
            alt,
            photosToString,
            date,
            type,
            keyword,
            id,
          ],
          (err, result) => {
            res.send({ message: "Zmieniono artykuł" });
          }
        );
      }
    } else {
      if (buildings.includes("szkołabranżowa")) {
        where += "szkołabranżowa, ";
      }

      if (buildings.includes("szkołabranżowaii")) {
        where += "szkołabranżowaii, ";
      }

      for (let i = 0; i < buildings.length; i++) {
        if (
          i != buildings.length - 1 &&
          buildings[i].toLowerCase() != "szkołabranżowa" &&
          buildings[i].toLowerCase() != "szkołabranżowaii"
        ) {
          where += buildings[i].toLowerCase() + ", ";
        } else {
          if (
            buildings[i].toLowerCase() != "szkołabranżowa" &&
            buildings[i].toLowerCase() != "szkołabranżowaii"
          ) {
            where += buildings[i].toLowerCase();
          }
        }
      }

      connection.execute(
        "UPDATE `artykul` SET `title`= ?,`shortdes`= ?,`longdes`= ?, `includes` = ?, `alt`= ?,`date`= ?,`type`= ?, `keyword` = ? WHERE id = ?",
        [title, shortDes, longDes, where.trim(), alt, date, type, keyword, id],
        (err, result) => {
          if (err) throw err;

          res.send({ message: "Zmieniono artykuł" });
        }
      );
    }
  }

  async getNumberMainPage(req, res) {
    connection.query("SELECT size FROM maxOnMain", (err, result) => {
      if (err) throw err;

      res.send({ number: result });
    });
  }

  async setNumberMainPage(req, res) {
    const numberFromUser = req.body.data;

    connection.query(
      "UPDATE `maxOnMain` SET `size`=?",
      [numberFromUser],
      (err, result) => {
        if (err) throw err;

        res.send({ msg: "Zmieniono liczbę" });
      }
    );
  }

  async getDetailsToEdit(req, res) {
    const id = req.params.id;

    connection.query(
      "SELECT * FROM artykul WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        res.send({ actualData: result });
      }
    );
  }

  async getArticleSelected(req, res) {
    const building = req.params.building;
    let sql = "";

    if (building == "szkołabranżowa") {
      sql = `SELECT * FROM artykul WHERE id != 262 AND includes LIKE '%szkołabranżowa%' AND includes NOT LIKE '%szkołabranżowaii%' ORDER BY date DESC`;
    } else {
      sql = `SELECT * FROM artykul WHERE id != 262 AND includes LIKE '%${building}%' ORDER BY date DESC`;
    }

    connection.query(sql, (err, result) => {
      if (err) {
        throw err;
      }

      res.send({ data: result });
    });
  }
}

module.exports = new articleController();
