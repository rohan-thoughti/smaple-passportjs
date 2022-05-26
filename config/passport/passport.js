const bCrypt = require("bcrypt-nodejs");
const passport = require("passport");
const Models = require("../../models");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function () {
  //SignUp
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        console.log(`Signup for ${email}`);
        var generateHash = function (password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };
        Models.Users.findOne({
          where: {
            email: email,
          },
        }).then(function (user) {
          if (user) {
            return done(null, false, {
              message: "Email already Exists",
            });
          }
          var userPassword = generateHash(password);
          var data = {
            name: req.body.name,
            email: email,
            password: userPassword,
            status: req.body.status ? req.body.status : false,
          };
          Models.Users.create(data).then(function (newUser) {
            if (!newUser) {
              return done(null, false);
            }
            if (newUser) {
              return done(null, newUser);
            }
          });
        });
      }
    )
  );

  // Signin

  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        var isValidPassword = function (userpass, password) {
          return bCrypt.compareSync(password, userpass);
        };
        console.log(`Logged to ${email}`);
        Models.Users.findOne({
          where: {
            email: email,
          },
        })
          .then(function (user) {
            console.log(user);
            if (!user) {
              return done(null, false, {
                message: "Email dose not Exist",
              });
            }
            if (!isValidPassword(user.password, password)) {
              return done(null, false, {
                message: "Incorrect Password",
              });
            }
            var userInfo = user.get();
            return done(null, userInfo);
          })
          .catch(function (err) {
            console.log(`Error ${err}`);
            return done(null, false, {
              message: "Something went wrong with Signin",
            });
          });
      }
    )
  );

  //Serialize

  passport.serializeUser(function (auth, done) {
    done(null, auth.user_id);
  });

  //Deserialize User

  passport.deserializeUser(function (user_id, done) {
    Models.Users.findByPk(user_id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
