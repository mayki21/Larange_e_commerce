const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");


const client_id="642881291931-7ll6qvq6hi5nir3hlcgqn2cfg5ia5fd1.apps.googleusercontent.com"
const client_secret="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"




passport.use(
  new GoogleStrategy(

    {
      clientID: client_id,
      clientSecret: client_secret,
      // callbackURL: "http://localhost:9006/users/auth/google/callback",
      callbackURL: "https://larangebackend.onrender.com/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      let user = {
        name: profile._json.name,
        email: profile._json.email,
        password: uuidv4(),
        avatar: profile._json.picture,
      };
      
      return cb(null, user);
    }
  )
);

module.exports = passport ;