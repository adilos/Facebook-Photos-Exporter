// modules =================================================
var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    config = require('./config/settings'),
    passport = require('passport');
    FacebookStrategy = require('passport-facebook').Strategy,
    _ = require('underscore');


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users


require('./app/routes/FacebookRoute')(app);
require('./app/routes/routes.js')(app);

 // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null,{});
    });


    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : config.facebook.clientID,
        clientSecret    : config.facebook.clientSecret,
        callbackURL     : 'http://localhost:2000/auth/facebook/callback'

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            console.log("token",token);
        });
    }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'user_photos' }));
    app.get('/auth/facebook/callback',passport.authenticate('facebook', {successRedirect : '/profile',failureRedirect : '/'}));
        


    var router = express.Router();
    router.use(function(req, res, next) {
                next();
    });

    // start app ===============================================
    var port = config.server.node.port || 4000;
    app.listen(port);
    console.log('App on port ' + port);        

       