const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; //For Authentication
const JwtStrategy = require("passport-jwt").Strategy; //For Authorization
const User = require("./models/User"); //User model from database
const bcrypt = require("bcrypt"); //Decrypt the encrypted password in database

//THIS HANDLES AUTHENTICATION(Passport-Local)
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    function (email, password, done) {
      //Checks if user exists in the database
      User.findOne({ email }, function (err, user) {
        //If there is error connecting to database
        if (err) {
          return done(err);
        }
        //If user is not found
        if (!user) {
          return done(null, false, { message: "Email does not exist" });
        }
        //Compare the password submitted with the one in the db.
        bcrypt.compare(password, user.password).then((isMatch) => {
          //if password is correct
          if (isMatch) {
            return done(null, user);
          }
          //If password is incorrect
          if (!isMatch) {
            return done(null, false, { message: "Password is incorrect" });
          }
        });
      });
    }
  )
);

//THIS HANDLES THE AUTHORIZATION WHEN USER IS LOGGED IN
const extractJwt = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

const options = {
  secretOrKey: "social_hippo_app",
  jwtFromRequest: extractJwt,
};

passport.use(
  new JwtStrategy(options, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
