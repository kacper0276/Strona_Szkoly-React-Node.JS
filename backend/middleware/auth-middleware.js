const jwt = require("jsonwebtoken");
const { keyjwt } = require("../helpers/config");

const verifyJWT = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken)
    return res.send({ error: "Błąd logowania! Nie autoryzowany użytkownik." });

  try {
    const validToken = jwt.verify(accessToken, keyjwt);
    req.user = validToken;
    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.send({ error: err });
  }
};

module.exports = { verifyJWT };
