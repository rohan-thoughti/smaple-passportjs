var passport = require("../config/passport/passport");
var db = require("../models");

module.exports = function (app, passport) {
  app.get("/", function (req, res) {
    res.send("Signin or Signup");
  });

  app.get("/logout", function (req, res) {
    console.log("Log Out Route Hit");
    req.session.destroy(function (err) {
      if (err) console.log(err);
      res.send({ message: "User Logged Out" });
    });
  });

  app.post(
    "/signup/newuser",
    passport.authenticate("local-signup"),
    function (req, res) {
      console.log(req.user);
      res.send({ message: "User Created" });
    }
  );

  app.post(
    "/login/user",
    passport.authenticate("local-signin"),
    function (req, res) {
      console.log(req.user);
      res.send({ message: "User Login" });
    }
  );
};
