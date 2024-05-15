const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if(!user) {
                return done(null, false, { message: "Incorrect username." });
            }

            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                return done(null, false, {message: "Incorrect password"} );
            }

            return done(null, user);
        }
        catch {
            return done(null, false, { message: "An error occurred." });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});