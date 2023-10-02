const connection = require("../helpers/databaseConnection.js");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

class userControllers {
  async register(req, res) {
    let login = req.body.login,
      haslo = req.body.password,
      haslo2 = req.body.sec_password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(haslo, salt);
    const klasa = req.body.classUser;
    let actualClassUser = "";

    klasa.forEach((classUser) => {
      actualClassUser += `${classUser.value}, `;
    });

    actualClassUser = actualClassUser.slice(0, -2);

    if (haslo == haslo2) {
      connection.query(
        "SELECT * FROM `logowanie` WHERE login = ?",
        [login],
        (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            const message = "Użytkownik o takim loginie istnieje";
            const jsonMessage = JSON.stringify(message);

            res.send({ message: jsonMessage });
          } else {
            connection.execute(
              "INSERT INTO `logowanie`(`login`, `password`, `klasa`) VALUES (?, ?, ?)",
              [login, hash, actualClassUser],
              (err, result) => {
                if (err) throw err;

                // res
                //   .setHeader("Content-Type", "application/json; charset=utf-8")
                //   .send({ message: "Dodano użytkownika" });

                const message = "Dodano użytkownika";
                const jsonMessage = JSON.stringify(message);
                res.send({ message: jsonMessage });
              }
            );
          }
        }
      );
    } else {
      const message = "Hasła nie są takie same";
      const jsonMessage = JSON.stringify(message);

      res.send({ message: jsonMessage });
    }
  }

  async login(req, res) {
    const username = req.body.login;
    const password = req.body.password;

    connection.query(
      "SELECT * FROM logowanie WHERE login = ?",
      username,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }

        if (result.length > 0) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              const accessToken = sign(
                { username: result[0].login },
                "scisletajnykluczdologowaniackziubrodnicauzytydojwt"
              );
              res.send({ auth: true, token: accessToken, userData: result });
            } else {
              // res
              //   .type("application/json")
              //   .send({ auth: false, errors: "Zły login lub hasło" });
              const errors = "Zły login lub hasło";
              const jsonErrors = JSON.stringify(errors);

              res.send({ auth: false, errors: jsonErrors });
            }
          });
        } else {
          const errors = "Zły login lub hasło";
          const jsonErrors = JSON.stringify(errors);

          res.send({ auth: false, errors: jsonErrors });
        }
      }
    );
  }

  async showUsers(req, res) {
    connection.query(
      "SELECT * FROM `logowanie` GROUP BY id;",
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
        res.send({ data: result });
      }
    );
  }

  async delete(req, res) {
    const id = req.params.id;

    connection.query(
      "SELECT * FROM `logowanie` WHERE id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          connection.query(
            "DELETE FROM `logowanie` WHERE id = ?",
            [id],
            (err, result) => {
              if (err) throw err;

              const message = "Usunięto użytkownika";
              const jsonMessage = JSON.stringify(message);

              res.send({ message: jsonMessage });
            }
          );
        } else {
          const message = "Podany użytkownik nie istnieje";
          const jsonMessage = JSON.stringify(message);

          res.send({ message: jsonMessage });
        }
      }
    );
  }

  async edit(req, res) {
    let login = req.body.login,
      haslo = req.body?.password,
      haslo2 = req.body?.sec_password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(haslo, salt);
    const klasa = req.body?.classUser;
    const id = req.params.id;
    let actualClassUser = "";
    let sql = "";

    if (klasa.length != 0) {
      klasa.forEach((classUser) => {
        actualClassUser += `${classUser.value}, `;
      });

      actualClassUser = actualClassUser.slice(0, -2);
    }

    if (haslo && klasa.length != 0) {
      sql = `UPDATE logowanie SET password='${hash}', klasa='${actualClassUser}', login='${login}' WHERE id=${id}`;
    } else if (haslo) {
      sql = `UPDATE logowanie SET password='${hash}', login='${login}' WHERE id=${id}`;
    } else if (haslo == "" && klasa.length != 0) {
      sql = `UPDATE logowanie SET login='${login}', klasa='${actualClassUser}' WHERE id=${id}`;
    } else {
      sql = `UPDATE logowanie SET login='${login}' WHERE id=${id}`;
    }

    if (haslo == haslo2) {
      connection.query(
        "SELECT * FROM `logowanie` WHERE id = ?",
        [id],
        (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            connection.query(sql, (err, result) => {
              if (err) throw err;
              const message = "Zmieniono dane";
              const jsonMessage = JSON.stringify(message);

              res.send({ message: jsonMessage });
            });
          } else {
            const errors = "Nie ma takiego użytkownika";
            const jsonErrors = JSON.stringify(errors);

            res.send({ message: jsonErrors });
          }
        }
      );
    } else {
      const errors = "Podane hasła są różne";
      const jsonErrors = JSON.stringify(errors);

      res.send({ errors: jsonErrors });
    }
  }

  async getDataFromUser(req, res) {
    const id = req.params.id;

    connection.execute(
      "SELECT * FROM logowanie WHERE id =?",
      [id],
      (err, result) => {
        if (err) throw err;

        res.send({ actualData: result });
      }
    );
  }
}

module.exports = new userControllers();
