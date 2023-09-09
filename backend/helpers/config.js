// require("dotenv").config({ path: __dirname + "./../.env" });
const ck = require("ckey");

module.exports = {
  host: ck.HOST,
  user: ck.USER,
  password: ck.PASSWORD,
  database: ck.DATABASE,
  keyjwt: ck.KEYJWT,
};
