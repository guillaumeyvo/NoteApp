// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('./database.js');
var email   = require("emailjs/email");
var randtoken = require('rand-token');

// load up the user model
//var User            = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {

        db.user_fcbk.findOne({where: {id: id}}).then(function(user){
            if(user == null){
                db.user.findOne({where: {id: id}}).then(function(user){
                    done(null, user);
                });


            }
            else{
                done(null, user);
            }
   
            

        }, function(e){
            throw e;
        })
        });
        

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
   function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists


        //==========SEQUELIZE VERSION ============


        db.user.findOne({
        where: {
            email: email
        }
    }).then(function(user) {
        if (user) {
            return done(null, false, req.flash('signupMessage', 'Cette addresse electronique est deja utilisee'));
        } else {
            console.log("aa",password);
            var token = randtoken.generate(16);
            var newUser ={email: email, password:password, email_verified:false,token :token,account_type:"local",avatar:"../../assets/img/prof.png"};
            db.user.create(newUser).then(function(user){
                // success case
                
                sendMail(user.email,user.token);
                return done(null, user,req.flash('signupMessage', 'Un email de confirmation de creation de compte vous a ete envoye'));
            }, function(e){
                return done(e);
            });
        }
    }, function(e) {
        throw e;
    });

        

        });

    }));



    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.user.authenticate({
            email: email,password:password
        }).then(
                function(user) {
                    if (user) {
                        console.log("User true");
                        if(user.email_verified==true)
                            return done(null, user);
                        else
                            return done(null, false, req.flash('loginMessage', 'Your account has not yet been activated'));
                    } else {
                        return done(null, false, req.flash('loginMessage', 'Wrong email or password.'));
                    }
                }, 
                function(e){
                    return done(null, false, req.flash('loginMessage', 'Wrong email or password.'));
                    //return done(e);
                    }
                );
        }
    

    ));
// =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ["emails", "displayName","photos"]

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {


            db.user_fcbk.findOne({
            where:{
                id:profile.id
            }}).then(
                function(user){
                    if (user) {

                        return done(null, user); // user found, return that user
                    } else {
                        var newFcbkUser ={id:  profile.id, avatar:profile.photos[0].value, token:token, name:profile.displayName,email :profile.emails[0].value,account_type:"facebook"};
                        db.user_fcbk.create(newFcbkUser).then(function(user){
                            var folderId;
                            console.log("Creation d u dossier par defaut");
                            //Creation d u dossier par defaut
                            var folder ={name:"Favoris"};
                            db.folder.create(folder).then(
                                function(folder){
                                folderId=folder.id;
                                user.addFolder(folder);
                                },
                                function(e){

                                }
                            );

                            console.log("Creation de la note par defaut");
                            var note ={title: "Ma premiere note",content:"Ceci est le contenu de votre premiere note",folder: "Favoris"};
                            db.note.create(note).then(
                                    function(note){

                                        db.folder.findOne({
                                        where:{
                                            id:folderId
                                        }
                                    }).then(
                                    function(folders){
                                        folders.addNote(note);
                                         //res.send(note);
                                    }                     
                                    )});
                        return done(null, user);
                        }, function(e){
                            return done(e);
                        });

                    }
                    
                   
                },
                function(e){
                    return done(e);
                            console.log("error");

                }
            );





            // find the user in the database based on their facebook id
            // User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

            //     // if there is an error, stop everything and return that
            //     // ie an error connecting to the database
            //     if (err)
            //         return done(err);

            //     // if the user is found, then log them in
            //     if (user) {
            //         return done(null, user); // user found, return that user
            //     } else {
            //         // if there is no user found with that facebook id, create them
            //         var newUser            = new User();
            //         console.log(profile)
            //         // set all of the facebook information in our user model
            //         newUser.facebook.id    = profile.id; // set the users facebook id                   
            //         newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
            //         //newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            //         newUser.facebook.name = profile.displayName;
            //         newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

            //         // save our user to the database
            //         newUser.save(function(err) {
            //             if (err)
            //                 throw err;

            //             // if successful, return the new user
            //             return done(null, newUser);
            //         });
            //     }

            // });
        });

    }));


};



function sendMail(user_email,user_token) {
    var server  = email.server.connect({
           user:    "guillaumeyvo", 
           password:"guiz@08080636", 
           host:    "smtp.gmail.com", 
           ssl:     true
        });

        // send the message and get a callback with an error or details of the message that was sent
        server.send({
           from:    "nodeapp@gmail.com", 
           to:      user_email,
           subject: "Emailjs",
           attachment: 
           [
              {data:"Click on the following link to activate your account <a href='http://localhost:8080/activation/?token="+user_token+"'>Activate your account</a> ", alternative:true},
           ]
            }, function(err, message) { 
                console.log(err || message); 
                if (err)
                {
                    console.log(err || message); 
                }
                else
                {
                      //res.render('index.ejs', {message : message}); // load the index.ejs file
                      
                      //next();

                }
            });
     //}
    
    
}
