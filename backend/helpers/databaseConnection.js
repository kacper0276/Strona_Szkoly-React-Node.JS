const mysql = require("mysql2");
const { database, password, host, user } = require("./config");

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
  multipleStatements: true,
});

module.exports = connection;
