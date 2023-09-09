const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const cors = require("cors");
const path = require("path");

// session
app.use(
  session({
    secret: "dsajkflkagjklajglkagj",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 }, // 2 day,
    resave: false,
  })
);

// public folder
app.use(express.static(path.join(__dirname, "build")));

// body parser // application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());

// mount routes
app.use(require("./router/web.js"));

//module.exports = app;
app.listen(8080, () => {
  console.log(`Server uruchomiony na porcie: 8080`);
});
