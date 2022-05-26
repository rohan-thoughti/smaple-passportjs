require("dotenv").config();
var express = require("express");

var app = express();
var passport = require("passport");
var session = require("express-session");
var PORT = process.env.APP_PORT;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// For passport
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
); // session secret

app.use(passport.initialize());

app.use(passport.session());

require("./routes")(app, passport);

require("./config/passport/passport.js")(passport, db.Auth);

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
