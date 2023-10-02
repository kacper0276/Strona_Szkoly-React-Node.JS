// const connection = require("../helpers/databaseConnection");
const { path } = require("app-root-path");
const mysql = require("mysql2");
const url = require("url");

const connection = mysql.createConnection({
  host: "mariadb106.zszbrodnica.nazwa.pl",
  user: "zszbrodnica_strona22",
  password: "KacperRenkel2022.",
  database: "zszbrodnica_strona22",
  multipleStatements: true,
});

class showController {
  async showMainPage(req, res) {
    let buildings,
      navigation = [],
      footer,
      mainArticle,
      onMain,
      title = "Główna";
    let size;

    connection.execute(
      "SELECT name, link FROM buildings WHERE type = 'poziom1' AND name != 'Wszystkie' ORDER BY sequence ASC",
      (err, result) => {
        if (err) throw err;
        else {
          buildings = result;
          connection.query(
            "SELECT `nazwa`, `path`, `glowny` FROM `menu` WHERE `lvl`=1 ORDER BY sequence ASC",
            (err, result) => {
              if (err) throw err;
              size = result.length;
              for (let i = 0; i < size; i++) {
                connection.query(
                  "SELECT nazwa, path, lvl AS type, id AS linkType FROM menu WHERE lvl < 3 AND glowny = ? ORDER BY type, sequence ASC",
                  [result[i].glowny],
                  (err, result) => {
                    if (result[0].type == 1) {
                      typeof result[1] != "undefined"
                        ? (result[0].type = "dropdown")
                        : (result[0].type = "link");

                      for (let j = 0; j < result.length; j++) {
                        result[j].path.includes("http")
                          ? (result[j].linkType = "outside")
                          : (result[j].linkType = "inside");
                      }
                    }
                    // console.log(result);
                    navigation.push(result);
                    if (i == size - 1) {
                      connection.execute(
                        "SELECT path, alt, link FROM footer",
                        (err, result) => {
                          if (err) throw err;
                          else {
                            footer = result;
                            connection.query(
                              "SELECT size FROM maxOnMain WHERE id = 1",
                              (err, result) => {
                                onMain = result[0].size;

                                connection.execute(
                                  `SELECT title, shortdes, longdes, img, alt, date, type FROM artykul WHERE includes LIKE '%glowna%' ORDER BY date DESC LIMIT ${onMain}`,

                                  (err, result) => {
                                    if (err) throw err;
                                    else {
                                      mainArticle = result;

                                      res.send({
                                        data: {
                                          buildings,
                                          navigation,
                                          footer,
                                          mainArticle,
                                          title,
                                        },
                                      });
                                    }
                                  }
                                );
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  async showContact(req, res) {
    const building = req.params.building;

    let allAddress = [];

    connection.query("SELECT which FROM contacts", (err, result) => {
      for (let i = 0; i < result.length; i++) {
        allAddress.push(result[i].which);

        if (i == result.length - 1) {
          if (allAddress.includes(building)) {
            connection.query(
              "SELECT email, phone_number, adres, link FROM contacts WHERE which = ?",
              building,
              (err, result) => {
                if (err) throw err;

                res.send({ contact: result });
              }
            );
          } else {
            connection.query(
              "SELECT email, phone_number, adres, link FROM contacts WHERE which = 'glowna'",
              (err, result) => {
                if (err) throw err;

                res.send({ contact: result });
              }
            );
          }
        }
      }
    });
  }

  async showMenuColor(req, res) {
    let linkParse = url.parse(req.url, true),
      title,
      navTitle,
      content,
      pathHTML = `<h3>`,
      links = [],
      link = `/content`,
      help = [],
      menu,
      which,
      type;

    connection.query(
      `SELECT glowny, rodzaj AS content FROM menu WHERE path LIKE '${linkParse.pathname.substr(
        4
      )}'`,
      (err, result) => {
        if (err) throw err;

        type = result[0].content;
        which = result[0].glowny;

        connection.query(
          "SELECT nazwa FROM menu WHERE glowny = ? AND lvl = 1",
          [which],
          (err, result) => {
            if (err) throw err;

            navTitle = result[0].nazwa;
            if (type != "kategoria") {
              content = type;

              const helpsLink = linkParse.pathname.substr(4).split("/");
              const LinkToHelp = `/${helpsLink[1]}/${helpsLink[2]}/${helpsLink[3]}`;

              connection.query(
                `SELECT path, nazwa FROM menu WHERE glowny = ? AND lvl > 2 AND rodzaj != 'kategoria' AND path LIKE '%${LinkToHelp}%'`,
                [which],
                (err, result) => {
                  if (err) throw err;

                  menu = result;

                  if (menu.length > 0) {
                    connection.query(
                      `SELECT nazwa, path, lvl, glowny FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                        4
                      )}'`,
                      (err, result) => {
                        title = result[0].nazwa;
                        for (let i = 0; i < result.length; i++) {
                          help.push(result[i].path.split("/"));
                        }
                        for (let i = 2; i <= result[0].lvl + 1; i++) {
                          link += `/${help[0][i]}`;
                          links.push(link);
                        }
                        for (let i = 2; i <= result[0].lvl + 1; i++) {
                          pathHTML += `/${help[0][i]}`;
                        }
                        pathHTML += `</h3>`;

                        res.send({
                          title,
                          navTitle,
                          content,
                          links,
                          pathHTML,
                          menu,
                        });
                      }
                    );
                  } else {
                    connection.query(
                      `SELECT nazwa, path, lvl, glowny FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                        4
                      )}'`,
                      (err, result) => {
                        title = result[0].nazwa;
                        for (let i = 0; i < result.length; i++) {
                          help.push(result[i].path.split("/"));
                        }
                        for (let i = 2; i <= result[0].lvl + 1; i++) {
                          link += `/${help[0][i]}`;
                          links.push(link);
                        }
                        for (let i = 2; i <= result[0].lvl + 1; i++) {
                          pathHTML += `/${help[0][i]}`;
                        }
                        pathHTML += `</h3>`;

                        res.send({
                          title,
                          navTitle,
                          content,
                          links,
                          pathHTML,
                        });
                      }
                    );
                  }
                }
              );
            } else {
              const helpsLink = linkParse.pathname.substr(4).split("/");
              const LinkToHelp = `/${helpsLink[1]}/${helpsLink[2]}/${helpsLink[3]}`;

              connection.query(
                `SELECT path, nazwa FROM menu WHERE glowny = ? AND lvl > 2 AND rodzaj != 'kategoria' AND path LIKE '%${LinkToHelp}%'`,
                [which],
                (err, result) => {
                  if (err) throw err;

                  menu = result;

                  if (menu.length > 0) {
                    connection.query(
                      `SELECT rodzaj AS content FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                        4
                      )}/%'`,
                      (err, result) => {
                        content = result[0].content;
                        connection.query(
                          `SELECT nazwa, path, lvl FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                            4
                          )}/%'`,
                          (err, result) => {
                            title = result[0].nazwa;

                            for (let i = 0; i < result.length; i++) {
                              help.push(result[i].path.split("/"));
                            }
                            for (let i = 2; i <= result[0].lvl + 1; i++) {
                              link += `/${help[0][i]}`;
                              links.push(link);
                            }
                            for (let i = 2; i <= result[0].lvl + 1; i++) {
                              pathHTML += `/${help[0][i]}`;
                            }
                            pathHTML += `</h3>`;

                            res.send({
                              title,
                              navTitle,
                              content,
                              links,
                              pathHTML,
                              menu,
                            });
                          }
                        );
                      }
                    );
                  } else {
                    connection.query(
                      `SELECT rodzaj AS content FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                        4
                      )}/%'`,
                      (err, result) => {
                        content = result[0].content;
                        connection.query(
                          `SELECT nazwa, path, lvl FROM menu WHERE path LIKE '${linkParse.pathname.substr(
                            4
                          )}/%'`,
                          (err, result) => {
                            title = result[0].nazwa;

                            for (let i = 0; i < result.length; i++) {
                              help.push(result[i].path.split("/"));
                            }
                            for (let i = 2; i <= result[0].lvl + 1; i++) {
                              link += `/${help[0][i]}`;
                              links.push(link);
                            }
                            for (let i = 2; i <= result[0].lvl + 1; i++) {
                              pathHTML += `/${help[0][i]}`;
                            }
                            pathHTML += `</h3>`;

                            res.send({
                              title,
                              navTitle,
                              content,
                              links,
                              pathHTML,
                            });
                          }
                        );
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    );
  }

  async showPaginateArticle(req, res) {
    const resultsPerPage = 8;
    const building = req.params.building.trim();
    let sql,
      list = "",
      path = "",
      listArticle = [],
      paths = [],
      obj,
      title = building;

    if (building == "szkołabranżowa") {
      sql = `SELECT id, title, shortdes, longdes, img, alt, date, type, keyword FROM artykul WHERE id != 262 AND includes LIKE '%szkołabranżowa%' AND includes NOT LIKE '%szkołabranżowaii%' ORDER BY date DESC`;
    } else {
      sql = `SELECT id, title, shortdes, longdes, img, alt, date, type, keyword FROM artykul WHERE id != 262 AND includes LIKE '%${building}%' ORDER BY date DESC`;
    }

    connection.query(
      "SELECT title AS name, includes AS path FROM artykul WHERE id = 262 ",
      (err, result) => {
        for (let i = 0; i < result.length; i++) {
          list += result[i].name;
          path += result[i].path;

          if (i == result.length - 1) {
            listArticle = list.split(",");
            paths = path.split(",");

            obj = listArticle.map((name, i) => ({
              name,
              path: paths[i],
            }));
          }
        }

        connection.query(sql, (err, result) => {
          if (err) throw err;

          if (result.length > 0) {
            const numOfResults = result.length;
            const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
            let page = req.query.page ? Number(req.query.page) : 1;

            if (page > numberOfPages) {
              // Przekierowanie jak za duża strona (Młody śmietnik by trollował)
            } else if (page < 1) {
              // Znowu młody śmietnik
            }
            const startingLimit = (page - 1) * resultsPerPage;

            if (building == "szkołabranżowa") {
              sql = `SELECT id, title, shortdes, longdes, img, alt, date, type, keyword FROM artykul WHERE id != 262 AND includes LIKE '%szkołabranżowa%' AND includes NOT LIKE '%szkołabranżowaii%' ORDER BY date DESC LIMIT ${startingLimit},${resultsPerPage}`;
            } else {
              // sql = `SELECT id, title, shortdes, longdes, img, alt, date, type, keyword FROM artykul WHERE id != 262 AND includes LIKE '%${building}%' ORDER BY date DESC`;
              sql = `SELECT id, title, shortdes, longdes, img, alt, date, type, keyword FROM artykul WHERE id != 262 AND includes LIKE '%${building}%' ORDER BY date DESC LIMIT ${startingLimit},${resultsPerPage}`;
            }

            connection.query(sql, (err, result) => {
              if (err) throw err;

              res.send({
                data: result,
                page,
                numberOfPages,
                obj,
                title,
              });
            });
          } else {
            res.send({ data: "Brak aktualności", obj, title });
          }
        });
      }
    );
  }

  async showMoreDetailsArticle(req, res) {
    const id = req.params.id;
    let title;

    connection.execute(
      `SELECT * FROM artykul WHERE id = ?`,
      [id],
      (err, result) => {
        if (err) throw err;

        if (result.length < 1) {
          res.send({ data: "Brak artykułu o podanym identyfikatorze" });
        } else {
          title = "Artykuł: " + result[0].title;
          res.send({ article: result, title });
        }
      }
    );
  }

  async searchHandler(req, res) {
    const keyword = req.body.keywords,
      title = "Szukanie frazy" + keyword;

    let arrayWords = keyword.toLowerCase().split(" "),
      sql = ``;

    arrayWords.forEach((el, key) => {
      sql += `keyword LIKE '%${el}%'`;
      if (key != arrayWords.length - 1) {
        sql += ` OR `;
      }
    });

    // keyword.trim().toLowerCase().replace(/\s+/g, "");

    connection.execute(
      `SELECT * FROM artykul WHERE ${sql}`,

      (err, result) => {
        if (err) throw err;

        if (result.length < 1) {
          res.send({
            searchData: "Nie znaleziono szukanej frazy",
            title: "Brak wyników",
          });
        } else if (result.length > 0) {
          res.send({ searchData: result, title });
        }
      }
    );
  }

  async showBuildingDetails(req, res) {
    const building = req.params.building;
    let contact, title;

    connection.query(
      "SELECT name from buildings WHERE type='poziom1' AND which = ?",
      [building],
      (err, result) => {
        title = result[0].name;
        connection.execute(
          "SELECT email, phone_number, adres FROM contacts WHERE which = ?",
          [building],
          (err, result) => {
            contact = result;
            connection.execute(
              "SELECT name, which, content, type, link, img FROM buildings WHERE type != 'poziom1' AND which = ? ORDER BY sequence ASC",
              [building],
              (err, result) => {
                if (err) throw err;

                for (let i = 0; i < result.length; i++) {
                  if (
                    result[i].link.includes("http") &&
                    result[i].type != "download"
                  ) {
                    result[i].type = "outside";
                  } else if (
                    !result[i].link.includes("http") &&
                    result[i].type != "download"
                  ) {
                    result[i].type = "inside";
                  }
                }

                res.send({ dataBuilding: result, contact: contact, title });
              }
            );
          }
        );
      }
    );
  }

  async showContentInBuilding(req, res) {
    const building = req.params.building,
      content = req.params.content,
      link = `/content/szkoly/${building}/${content}`,
      title = content;

    connection.execute(
      "SELECT content FROM buildings WHERE which = ? AND link = ?",
      [building, link],
      (err, result) => {
        if (err) throw err;

        res.send({ content: result[0].content, title });
      }
    );
  }

  async showMap(req, res) {
    let building = [],
      sizeBuilding,
      sendBuilding = [],
      navigation = [],
      sendNavigation = [],
      sizeNav,
      lengthMainBuilding,
      lengthInBuilding,
      lengthMainMenu,
      lengthInMenu;

    let link = ``;

    connection.query(
      "SELECT name, link, which FROM buildings WHERE type = 'poziom1'",
      (err, result) => {
        sizeBuilding = result.length;
        for (let i = 0; i < sizeBuilding; i++) {
          connection.query(
            "SELECT name, type, which, link FROM buildings WHERE which = ?",
            [result[i].which],
            (err, result) => {
              if (err) throw err;

              building.push(result);
              if (i == sizeBuilding - 1) {
                lengthMainBuilding = building.length;
                for (let j = 0; j < lengthMainBuilding; j++) {
                  lengthInBuilding = building[j].length;
                  for (let k = 0; k < lengthInBuilding; k++) {
                    k == 0
                      ? (link += `<ul class='map-ul'><a href=${building[j][k].link}>${building[j][k].name} </a></ul> <br>`)
                      : (link += `<li class='map-li'><a href=${building[j][k].link}>${building[j][k].name} </a></li> <br>`);
                  }
                }
                connection.query(
                  "SELECT glowny FROM menu WHERE lvl = 1",
                  (err, result) => {
                    if (err) throw err;

                    sizeNav = result.length;

                    for (let i = 0; i < sizeNav; i++) {
                      connection.query(
                        "SELECT nazwa, path, lvl AS type, rodzaj FROM menu WHERE glowny = ?",
                        [result[i].glowny],
                        (err, result) => {
                          navigation.push(result);

                          if (i == sizeNav - 1) {
                            lengthMainMenu = navigation.length;

                            for (let l = 0; l < lengthMainMenu; l++) {
                              lengthInMenu = navigation[l].length;
                              for (let k = 0; k < lengthInMenu; k++) {
                                if (k == 0) {
                                  link += `<ul class='map-ul'><a href=${navigation[l][k].path}>${navigation[l][k].nazwa}</a></ul> <br>`;
                                } else if (
                                  navigation[l][k].rodzaj == "kategoria"
                                ) {
                                  link += `<ul class='map-ul'><a href=${navigation[l][k].path}>${navigation[l][k].nazwa}</a></ul> <br>`;
                                } else {
                                  link += `<li class='map-li'><a href=${navigation[l][k].path}>${navigation[l][k].nazwa}</a></li> <br>`;
                                }
                              }
                            }
                            res.send({
                              content: link,
                              title: "Mapa strony",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  }
}

module.exports = new showController();
