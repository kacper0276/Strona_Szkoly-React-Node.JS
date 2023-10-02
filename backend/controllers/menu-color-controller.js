const connection = require("../helpers/databaseConnection.js");
const removePolishChar = require("../helpers/deletePolishChar.js");

class menuColorController {
  async addColorMenu(req, res) {
    let path = req.body.path ? req.body.path : "",
      type = req.body.type,
      lvl,
      main,
      which = req.body.which ? req.body.which : "",
      name = req.body.name,
      category = req.body.category ? req.body.category : "",
      rodzaj = req.body.rodzaj ? req.body.rodzaj : "";

    if (type == "poziom1") {
      path == ""
        ? (path =
            "/content/" +
            removePolishChar(name.toLowerCase().replace(/ /g, "")))
        : (path = path);
      lvl = 1;
      main = removePolishChar(name.toLowerCase().replace(/ /g, ""));

      if (rodzaj != "") {
        type = rodzaj.replaceAll('href="', 'href="/');
        type = type.replaceAll('href="/http', 'href="http');
        type = type.replaceAll('src="', 'src="/');
        type = type.replaceAll("background: white;", "");
        path = `/content/${removePolishChar(
          name.toLowerCase().replace(/ /g, "")
        )}/${removePolishChar(name.toLowerCase().replace(/ /g, ""))}`;
      } else {
        type = type;
      }

      connection.execute(
        "INSERT INTO `menu`( `nazwa`, `path`, `rodzaj`, `lvl`, `glowny`, `sequence`) VALUES (?, ?, ?, ?, ?, ?)",
        [name, path, type, lvl, main, 15],
        (err, result) => {
          if (err) throw err;

          res.send({ msg: "Dodano Poziom 1" });
        }
      );
    } else if (type == "kategoria") {
      if (category == "") {
        which = which.toLowerCase().replace(/ /g, "");
        connection.execute(
          "SELECT path, lvl, glowny FROM menu WHERE glowny = ?",
          [which],
          (err, result) => {
            path = result[0].path + "/";
            path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            // type = type.replaceAll('href="content', 'href="/content');
            // type = type.replaceAll('href="files', 'href="/files');
            // type = type.replaceAll('href="aktualnosci', 'href="/aktualnosci');
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "INSERT INTO `menu`( `nazwa`, `path`, `rodzaj`, `lvl`, `glowny`, `sequence`) VALUES (?, ?, ?, ?, ?, ?)",
              [name, path, type, lvl, main, 10],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      } else {
        which = which.toLowerCase().replace(/ /g, "");
        category = category.toLowerCase().replace(/ /g, "");
        connection.query(
          `SELECT path, lvl, glowny FROM menu WHERE path LIKE '%${category}%' AND rodzaj = 'kategoria'`,
          (err, result) => {
            // path = result[0].path + "/";
            // path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;

            path == ""
              ? (path =
                  result[0].path +
                  "/" +
                  removePolishChar(name.toLowerCase().replace(/ /g, "")))
              : (path = path);

            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "INSERT INTO `menu`( `nazwa`, `path`, `rodzaj`, `lvl`, `glowny`, `sequence`) VALUES (?, ?, ?, ?, ?, ?)",
              [name, path, type, lvl, main, 10],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      }
    } else {
      if (category == "") {
        which = which.toLowerCase().replace(/ /g, "");
        connection.execute(
          "SELECT path, lvl, glowny FROM menu WHERE glowny = ?",
          [which],
          (err, result) => {
            path == ""
              ? (path =
                  result[0].path +
                  "/" +
                  removePolishChar(name.toLowerCase().replace(/ /g, "")))
              : (path = path);
            // path = result[0].path + "/";
            // path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "INSERT INTO `menu`( `nazwa`, `path`, `rodzaj`, `lvl`, `glowny`, `sequence`) VALUES (?, ?, ?, ?, ?, ?)",
              [name, path, type, lvl, main, 10],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      } else {
        which = which.toLowerCase().replace(/ /g, "");
        category = category.toLowerCase().replace(/ /g, "");
        connection.query(
          `SELECT path, lvl, glowny FROM menu WHERE path LIKE '%${category}%' AND rodzaj = 'kategoria'`,
          (err, result) => {
            path == ""
              ? (path =
                  result[0].path +
                  "/" +
                  removePolishChar(name.toLowerCase().replace(/ /g, "")))
              : (path = path);

            // path = result[0].path + "/";
            // path += removePolishChar(name.toLowerCase().replace(/ /g, ""));

            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            // type = type.replaceAll('href="content', 'href="/content');
            // type = type.replaceAll('href="files', 'href="/files');
            // type = type.replaceAll('href="aktualnosci', 'href="/aktualnosci');
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");
            connection.execute(
              "INSERT INTO `menu`( `nazwa`, `path`, `rodzaj`, `lvl`, `glowny`, `sequence`) VALUES (?, ?, ?, ?, ?, ?)",
              [name, path, type, lvl, main, 15],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      }
    }
  }

  async deleteColorMenu(req, res) {
    const id = req.params.id;

    connection.execute(
      "DELETE FROM  `menu` WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        res.send({ msg: "Usunięto rekord" });
      }
    );
  }

  async showAllEdit(req, res) {
    connection.query("SELECT * FROM menu", (err, result) => {
      if (err) {
        throw err;
      }

      res.send({ data: result });
    });
  }

  async editColorMenu(req, res) {
    const id = req.params.id;

    let path = req.body.path,
      type = req.body.type,
      lvl,
      main,
      which = req.body.which,
      name = req.body.name,
      category = req.body.category ? req.body.category : "",
      rodzaj = req.body.rodzaj ? req.body.rodzaj : "";

    if (type == "poziom1") {
      path == ""
        ? (path =
            "/content/" +
            removePolishChar(name.toLowerCase().replace(/ /g, "")))
        : (path = path);
      lvl = 1;
      main = removePolishChar(name.toLowerCase().replace(/ /g, ""));

      if (rodzaj != "") {
        // type = rodzaj.replaceAll('href="', 'href="/');
        type = rodzaj.replaceAll('href="', 'href="/');
        type = type.replaceAll('href="/http', 'href="http');
        type = type.replaceAll('src="', 'src="/');
        type = type.replaceAll("background: white;", "");
        path = `/content/${removePolishChar(
          name.toLowerCase().replace(/ /g, "")
        )}/${removePolishChar(name.toLowerCase().replace(/ /g, ""))}`;
      } else {
        type = type;
      }

      connection.execute(
        "UPDATE `menu` SET `nazwa`= ?, `path`= ?, `rodzaj`= ?, `lvl`= ?, `glowny`= ? WHERE id = ?",
        [name, path, type, lvl, main, id],
        (err, result) => {
          if (err) throw err;

          res.send({ msg: "Zmiana" });
        }
      );
    } else if (type == "kategoria") {
      if (category == "") {
        which = which.toLowerCase().replace(/ /g, "");
        connection.execute(
          "SELECT path, lvl, glowny FROM menu WHERE glowny = ?",
          [which],
          (err, result) => {
            path = result[0].path + "/";
            path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            // type = type.replaceAll('href="content', 'href="/content');
            // type = type.replaceAll('href="files', 'href="/files');
            // type = type.replaceAll('href="aktualnosci', 'href="/aktualnosci');
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "UPDATE `menu` SET `nazwa`= ?, `path`= ?, `rodzaj`= ?, `lvl`= ?, `glowny`= ? WHERE id = ?",
              [name, path, type, lvl, main, id],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      } else {
        which = which.toLowerCase().replace(/ /g, "");
        category = category.toLowerCase().replace(/ /g, "");
        connection.query(
          `SELECT path, lvl, glowny FROM menu WHERE path LIKE '%${category}%' AND rodzaj = 'kategoria'`,
          (err, result) => {
            path = result[0].path + "/";
            path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            // type = type.replaceAll('href="content', 'href="/content');
            // type = type.replaceAll('href="files', 'href="/files');
            // type = type.replaceAll('href="aktualnosci', 'href="/aktualnosci');
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "UPDATE `menu` SET `nazwa`= ?, `path`= ?, `rodzaj`= ?, `lvl`= ?, `glowny`= ? WHERE id = ?",
              [name, path, type, lvl, main, id],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      }
    } else {
      if (category == "") {
        which = which.toLowerCase().replace(/ /g, "");
        connection.execute(
          "SELECT path, lvl, glowny FROM menu WHERE glowny = ?",
          [which],
          (err, result) => {
            path == ""
              ? (path =
                  result[0].path +
                  "/" +
                  removePolishChar(name.toLowerCase().replace(/ /g, "")))
              : (path = path);

            // path = result[0].path + "/";
            // path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "UPDATE `menu` SET `nazwa`= ?, `path`= ?, `rodzaj`= ?, `lvl`= ?, `glowny`= ? WHERE id = ?",
              [name, path, type, lvl, main, id],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      } else {
        which = which.toLowerCase().replace(/ /g, "");
        category = removePolishChar(category.toLowerCase().replace(/ /g, ""));
        connection.query(
          `SELECT path, lvl, glowny FROM menu WHERE path LIKE '%${category}%' AND rodzaj = 'kategoria'`,
          (err, result) => {
            path == ""
              ? (path =
                  result[0].path +
                  "/" +
                  removePolishChar(name.toLowerCase().replace(/ /g, "")))
              : (path = path);
            // path = result[0].path + "/";
            // path += removePolishChar(name.toLowerCase().replace(/ /g, ""));
            lvl = result[0].lvl + 1;
            main = result[0].glowny;
            type = type.replaceAll('href="', 'href="/');
            type = type.replaceAll('href="/http', 'href="http');
            type = type.replaceAll('src="', 'src="/');
            type = type.replaceAll("background: white;", "");

            connection.execute(
              "UPDATE `menu` SET `nazwa`= ?, `path`= ?, `rodzaj`= ?, `lvl`= ?, `glowny`= ? WHERE id = ?",
              [name, path, type, lvl, main, id],
              (err, result) => {
                if (err) throw err;

                res.send({ msg: "Dodano!" });
              }
            );
          }
        );
      }
    }
  }

  async getLvl1(req, res) {
    connection.query(
      "SELECT * FROM menu WHERE rodzaj='poziom1' OR lvl=1 ORDER BY sequence ASC",
      (err, result) => {
        if (err) throw err;

        res.send({ menu: result });
      }
    );
  }

  async getCategory(req, res) {
    let which = req.params.which;
    which = which.toLowerCase().replace(/ /g, "");

    connection.query(
      "SELECT * FROM menu WHERE glowny=? AND rodzaj='kategoria'",
      [which],
      (err, result) => {
        if (err) throw err;

        res.send({ category: result });
      }
    );
  }

  async getDetailsInLvl1(req, res) {
    const main = req.params.main;

    connection.query(
      "SELECT * FROM menu WHERE glowny = ? AND rodzaj != 'poziom1' ",
      [main],
      (err, result) => {
        if (err) throw err;

        res.send({ data: result });
      }
    );
  }

  async getDataOneItem(req, res) {
    const id = req.params.id;

    connection.query("SELECT * FROM menu WHERE id=?", [id], (err, result) => {
      if (err) throw err;

      res.send({ data: result });
    });
  }

  async setSequenceMenuLvl1(req, res) {
    const sequence = req.body.sequence;
    let pom = 1;

    connection.query(
      "SELECT * FROM `menu` WHERE lvl = 1 OR rodzaj='poziom1'",
      (err, result) => {
        if (err) throw err;

        if (result.length != sequence.length) {
          res.send({ msg: "Nie wybrano wszystkich opcji!" });
        } else {
          for (let i = 0; i < sequence.length; i++) {
            connection.query(
              "UPDATE menu SET `sequence`=? WHERE glowny = ? AND lvl = 1",
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

  async getDetailsSequenceMenu(req, res) {
    const which = req.params.menu;

    connection.query(
      "SELECT * FROM menu WHERE lvl = 2 AND glowny=? ORDER BY sequence ASC",
      [which],
      (err, result) => {
        if (err) throw err;

        res.send({ menu: result });
      }
    );
  }

  async setSequenceMenu(req, res) {
    const which = req.params.which,
      sequence = req.body.sequence;
    let pom = 1;

    connection.query(
      "SELECT * FROM menu WHERE lvl=2 AND glowny=?",
      [which],
      (err, result) => {
        if (err) throw err;

        if (result.length != sequence.length) {
          res.send({ msg: "Nie wybrano wszystkich opcji" });
        } else {
          for (let i = 0; i < sequence.length; i++) {
            connection.query(
              "UPDATE menu SET `sequence`=? WHERE nazwa = ? AND lvl=2 AND glowny=?",
              [pom, sequence[i].value, which],
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

module.exports = new menuColorController();
