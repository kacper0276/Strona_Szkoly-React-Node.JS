const e = require("express");
const connection = require("../helpers/databaseConnection.js");

class buildingsController {
  async addBuildings(req, res) {
    let name = req.body.name,
      type = req.body.type,
      color = req.body.color ? req.body.color : "BRAK",
      link = req.body.link ? req.body.link : "BRAK",
      content = req.body.contents ? req.body.contents : "BRAK",
      which = req.body.which ? req.body.which : "BRAK",
      backgroundImg = "BRAK",
      img = req.body.img ? req.body.img : "BRAK";

    if (type == "poziom1") {
      link == "BRAK"
        ? (link = `/szkoly/${name.toLowerCase().replace(/\s+/g, "")}`)
        : (link = link);
      which = name.toLowerCase().replace(/\s+/g, "");
      img = "";

      connection.execute(
        "SELECT title, includes FROM artykul WHERE id = 262",
        (err, result) => {
          let titleActual = result[0].title;
          let includesActual = result[0].includes;
          titleActual += `, ${name}`;
          includesActual += `, ${name.toLowerCase().replace(/\s+/g, "")}`;
          content = content.replaceAll('href="', 'href="/');

          connection.execute(
            "UPDATE artykul SET title=?, includes=? WHERE id = 262",
            [titleActual, includesActual],
            (err, result) => {
              if (err) throw err;
              connection.execute(
                "INSERT INTO `buildings` (`name`, `type`, `color`, `backgroundImg`, `which`, `content`, `link`, `img`, `sequence`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                  name,
                  type,
                  color,
                  backgroundImg,
                  which,
                  content,
                  link,
                  img,
                  10,
                ],
                (err, result) => {
                  if (err) throw err;

                  res.send({ message: "Dodano budynek" });
                }
              );
            }
          );
        }
      );
    } else if (type == "download") {
      // content = content.replaceAll('href="', 'href="/');
      content = content.replaceAll('href="', 'href="/');
      content = content.replaceAll('href="/http', 'href="http');
      content = content.replaceAll('src="', 'src="/');
      connection.execute(
        "INSERT INTO `buildings` (`name`, `type`, `color`, `backgroundImg`, `which`, `content`, `link`, `img`, `sequence`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [name, type, color, backgroundImg, which, content, link, img, 10],
        (err, result) => {
          if (err) throw err;

          res.send({ message: "Dodano!" });
        }
      );
    } else {
      if (name.includes("Aktualności")) {
        connection.query(
          "SELECT which FROM buildings WHERE which = ? AND type = 'poziom1'",
          [which],
          (err, result) => {
            if (err) throw err;

            link = `/aktualnosci/${result[0].which}/1`;
            // content = content.replaceAll('href="', 'href="/');
            content = content.replaceAll('href="', 'href="/');
            content = content.replaceAll('href="/http', 'href="http');
            content = content.replaceAll('src="', 'src="/');

            connection.execute(
              "INSERT INTO `buildings` (`name`, `type`, `color`, `backgroundImg`, `which`, `content`, `link`, `img`, `sequence`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [name, type, color, backgroundImg, which, content, link, img, 10],
              (err, result) => {
                if (err) throw err;

                res.send({ message: "Dodano!" });
              }
            );
          }
        );
      } else {
        connection.query(
          "SELECT link FROM buildings WHERE which = ? AND type = 'poziom1'",
          [which],
          (err, result) => {
            if (err) throw err;
            // console.log(which);
            // console.log(content);

            link =
              link != "BRAK"
                ? link
                : `/content${result[0].link}/${name
                    .toLowerCase()
                    .replace(/\s+/g, "")}`;
            // content = content.replaceAll('href="content', 'href="/content');
            // content = content.replaceAll('href="files', 'href="/files');
            // content = content.replaceAll(
            //   'href="aktualnosci',
            //   'href="/aktualnosci'
            // );
            content = content.replaceAll('href="', 'href="/');
            content = content.replaceAll('href="/http', 'href="http');
            content = content.replaceAll('src="', 'src="/');

            connection.execute(
              "INSERT INTO `buildings` (`name`, `type`, `color`, `backgroundImg`, `which`, `content`, `link`, `img`, `sequence`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [name, type, color, backgroundImg, which, content, link, img, 10],
              (err, result) => {
                if (err) throw err;

                res.send({ message: "Dodano!" });
              }
            );
          }
        );
      }
    }
  }

  async showAllBuildingsToEdit(req, res) {
    connection.query("SELECT * FROM `buildings`", (err, result) => {
      if (err) {
        throw err;
      }

      res.send({ data: result });
    });
  }

  async deleteBuildings(req, res) {
    const id = req.params.id;
    let nameRecord = "",
      whichRecord = "";

    connection.execute(
      "SELECT name, which FROM buildings WHERE id=?",
      [id],
      (err, result) => {
        if (err) throw err;
        nameRecord = result[0].name;
        whichRecord = result[0].which;
        connection.execute(
          "SELECT title, includes FROM artykul WHERE id = 262",
          (err, result) => {
            if (err) throw err;
            let titleActual = result[0].title;
            let includesActual = result[0].includes;

            if (titleActual.includes(`${nameRecord},`)) {
              titleActual = titleActual.replace(` ${nameRecord},`, "");
            } else {
              titleActual = titleActual.replace(`, ${nameRecord}`, "");
            }

            if (includesActual.includes(`${whichRecord},`)) {
              includesActual = includesActual.replace(` ${whichRecord},`, "");
            } else {
              includesActual = includesActual.replace(`, ${whichRecord}`, "");
            }

            connection.execute(
              "UPDATE artykul SET title=?, includes=? WHERE id = 262",
              [titleActual, includesActual],
              (err, result) => {
                if (err) throw err;
                connection.execute(
                  "DELETE FROM  `buildings` WHERE id = ?",
                  [id],
                  (err, result) => {
                    if (err) throw err;

                    res.send({ msg: "Usunięto budynek" });
                  }
                );
              }
            );
          }
        );
      }
    );
  }

  async editBuildings(req, res) {
    const id = req.params.id;

    let name = req.body.name,
      type = req.body.type,
      color = req.body.color ? req.body.color : "BRAK",
      link = req.body.link ? req.body.link : "BRAK",
      content = req.body.contents ? req.body.contents : "BRAK",
      which = req.body.which ? req.body.which : "BRAK",
      backgroundImg = "BRAK",
      img = req.body.img ? req.body.img : "BRAK";

    if (type == "poziom1") {
      link == "BRAK"
        ? (link = `/szkoly/${name.toLowerCase().replace(/\s+/g, "")}`)
        : (link = link);
      which = name.toLowerCase().replace(/\s+/g, "");
      img = "";

      connection.execute(
        "SELECT title, includes FROM artykul WHERE id = 262",
        (err, result) => {
          let titleActual = result[0].title;
          let includesActual = result[0].includes;
          titleActual += `, ${name}`;
          includesActual += `, ${name.toLowerCase().replace(/\s+/g, "")}`;
          content = content.replaceAll('href="', 'href="/');
          content = content.replaceAll('href="/http', 'href="http');
          content = content.replaceAll('src="', 'src="/');
          connection.execute(
            "UPDATE artykul SET title=?, includes=? WHERE id = 262",
            [titleActual, includesActual],
            (err, result) => {
              if (err) throw err;
              connection.execute(
                "UPDATE `buildings` SET `name`=?, `type`=?, `color`=?, `backgroundImg`=?, `which`=?, `content`=?, `link`=?, `img`=?, `sequence`=? WHERE id=?",
                [
                  name,
                  type,
                  color,
                  backgroundImg,
                  which,
                  content,
                  link,
                  img,
                  10,
                  id,
                ],
                (err, result) => {
                  if (err) throw err;

                  res.send({ message: "Dodano budynek" });
                }
              );
            }
          );
        }
      );
    } else if (type == "download") {
      content = content.replaceAll('href="', 'href="/');
      content = content.replaceAll('href="/http', 'src="http');
      content = content.replaceAll('src="', 'src="/');
      connection.execute(
        "UPDATE `buildings` SET `name`=?, `type`=?, `color`=?, `backgroundImg`=?, `which`=?, `content`=?, `link`=?, `img`=?, `sequence`=? WHERE id=?",
        [name, type, color, backgroundImg, which, content, link, img, 10, id],
        (err, result) => {
          if (err) throw err;
          res.send({ message: "Dodano!" });
        }
      );
    } else {
      if (name.includes("Aktualności")) {
        connection.query(
          "SELECT which FROM buildings WHERE which = ? AND type = 'poziom1'",
          [which],
          (err, result) => {
            if (err) throw err;
            link = `/aktualnosci/${result[0].which}/1`;
            content = content.replaceAll('href="', 'href="/');
            content = content.replaceAll('href="/http', 'href="http');
            content = content.replaceAll('src="', 'src="/');
            connection.execute(
              "UPDATE `buildings` SET `name`=?, `type`=?, `color`=?, `backgroundImg`=?, `which`=?, `content`=?, `link`=?, `img`=?, `sequence`=? WHERE id=?",
              [
                name,
                type,
                color,
                backgroundImg,
                which,
                content,
                link,
                img,
                10,
                id,
              ],
              (err, result) => {
                if (err) throw err;
                res.send({ message: "Dodano!" });
              }
            );
          }
        );
      } else {
        connection.query(
          "SELECT link FROM buildings WHERE which = ? AND type = 'poziom1'",
          [which],
          (err, result) => {
            if (err) throw err;
            // console.log(which);
            // console.log(content);
            link =
              link != "BRAK"
                ? link
                : `/content${result[0].link}/${name
                    .toLowerCase()
                    .replace(/\s+/g, "")}`;
            // content = content.replaceAll('href="content', 'href="/content');
            // content = content.replaceAll('href="files', 'href="/files');
            // content = content.replaceAll(
            //   'href="aktualnosci',
            //   'href="/aktualnosci'
            // );
            content = content.replaceAll('href="', 'href="/');
            content = content.replaceAll('href="/http', 'href="http');
            content = content.replaceAll('src="', 'src="/');

            connection.execute(
              "UPDATE `buildings` SET `name`=?, `type`=?, `color`=?, `backgroundImg`=?, `which`=?, `content`=?, `link`=?, `img`=?, `sequence`=? WHERE id=?",
              [
                name,
                type,
                color,
                backgroundImg,
                which,
                content,
                link,
                img,
                10,
                id,
              ],
              (err, result) => {
                if (err) throw err;
                res.send({ message: "Dodano!" });
              }
            );
          }
        );
      }
    }
  }

  async showAllPhotos(req, res) {
    connection.execute("SELECT * FROM usedPhtos", (err, result) => {
      if (err) throw err;

      res.send({ photos: result });
    });
  }

  async showAllBuildings(req, res) {
    connection.query(
      "SELECT * FROM buildings WHERE type='poziom1' AND name != 'Wszystkie'",
      (err, result) => {
        if (err) throw err;

        res.send({ buildings: result });
      }
    );
  }

  async showSequenceBuildings(req, res) {
    connection.query(
      "SELECT name, which FROM buildings WHERE type = 'poziom1' AND name != 'Wszystkie' ORDER BY sequence ASC",
      (err, result) => {
        if (err) throw err;

        res.send({ data: result });
      }
    );
  }

  async setSequence(req, res) {
    const sequence = req.body.sequence;
    let pom = 1;

    connection.query(
      "SELECT name FROM buildings WHERE type='poziom1' AND name!='wszystkie'",
      (err, result) => {
        if (err) throw err;
        const len = result.length;

        if (result.length != sequence.length) {
          res.send({ msg: "Nie wybrano wszystkich opcji" });
        } else {
          for (let i = 0; i < sequence.length; i++) {
            connection.query(
              "UPDATE buildings SET `sequence`=? WHERE name = ? AND type = 'poziom1'",
              [pom, sequence[i].value],
              (err, result) => {
                if (err) throw err;
              }
            );
            pom++;
            if (pom == sequence.length) {
              res.send({ msg: "Zmieniono kolejność" });
            }
          }
        }
      }
    );
  }

  async getDetailsBuilding(req, res) {
    let nameBuilding = req.params.namebuilding.toLowerCase().replace(/ /g, "");

    connection.query(
      "SELECT * FROM buildings WHERE type != 'poziom1' AND which = ?",
      [nameBuilding],
      (err, result) => {
        if (err) throw err;

        res.send({ buildings: result });
      }
    );
  }

  async deleteBuildingDetails(req, res) {
    const id = req.params.id;

    connection.query(
      "DELETE FROM buildings WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        res.send({ message: "Usunięto rekord" });
      }
    );
  }

  async getDetailsInBuildingOne(req, res) {
    const id = req.params.id;

    connection.query(
      "SELECT * FROM buildings WHERE id=?",
      [id],
      (err, result) => {
        res.send({ data: result });
      }
    );
  }

  async setBuildingContentSequence(req, res) {
    const building = req.params.building;
    const sequence = req.body.sequence;
    let pom = 1;

    connection.query(
      "SELECT name FROM buildings WHERE type!='poziom1' AND name!='wszystkie' and which = ?",
      [building],
      (err, result) => {
        if (err) throw err;
        // const len = result.length;

        if (result.length != sequence.length) {
          res.send({ msg: "Nie wybrano wszystkich opcji" });
        } else {
          for (let i = 0; i < sequence.length; i++) {
            connection.query(
              "UPDATE buildings SET `sequence`=? WHERE name = ? AND type!='poziom1' AND which=?",
              [pom, sequence[i].value, building],
              (err, result) => {
                if (err) throw err;
              }
            );
            pom++;
            if (pom == sequence.length) {
              res.send({ msg: "Zmieniono kolejność" });
            }
          }
        }
      }
    );
  }
}

module.exports = new buildingsController();
