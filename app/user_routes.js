var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var randtoken = require('rand-token');
var fs = require("fs");
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './app/public/assets/avatar');
  },
  filename: function (req, file, callback) {
    callback(null, req.user.email + file.originalname.substring(file.originalname.lastIndexOf('.')));
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================

    app.get('/', function(req, res) {
        if (req.isAuthenticated()) {
            if (req.user.account_type == "local") {
                db.folder.findAll({
                    where: {
                        userId: req.user.id
                    },
                    include: [{
                            model: db.note
                        }, // load all pictures
                    ]
                }).then(function(data) {

                        res.render('main.ejs', {
                            user: req.user,
                            avatar: req.user.avatar,
                            email: req.user.email,
                            data: data,
                            account_type: req.user.account_type
                        });
                    },
                    function(e) {
                        console.log("error");
                        console.log(e);

                    });



            } else {

                db.folder.findAll({
                    where: {
                        userFcbkId: req.user.id
                    },
                    include: [{
                            model: db.note
                        }, // load all pictures
                    ]
                }).then(function(data) {
                        res.render('main.ejs', {
                            user: req.user,
                            avatar: req.user.avatar,
                            email: req.user.email,
                            data: data,
                            account_type: req.user.account_type
                        });
                    },
                    function(e) {
                        console.log("error");
                        console.log(e);

                    });

            }

        } else {
            res.render('log.ejs', {
                message: req.flash('loginMessage')
            }); // load the index.ejs file

        }

    });


    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    app.get('/forgotpassword', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('forgot.ejs', {
            message: req.flash('Message')
        });
    });

    app.post('/forgotpassword', function(req, res) {

        var email = req.body.email;
        db.user.findOne({
            where: {
                email: email
            }
        }).then(
            function(user) {
                var token = randtoken.generate(16);
                req.flash('forgot', 'Check your email');
                user.updateAttributes({
                    token: token
                });
                sendMail(user.email, token, "reset");
                //console.log("Before activated.js");
                res.render('forgot.ejs', {
                    message: req.flash('forgot')
                });

            },
            function(e) {
                console.log("error");
                console.log(e);
                req.flash('forgot', 'An error has occured');
                res.render('forgotpassword.ejs', {
                    message: req.flash('forgot')
                });


            });

    });


    app.get('/resetpassword/', function(req, res) {

        // render the page and pass in any flash data if it exists
        var token = req.query.token;
        console.log(token);
        res.render('reset.ejs', {
            message: req.flash('Message'),
            token: token
        });
    });


    app.post('/resetpassword', function(req, res) {
        var token = req.query.token;
        console.log("token", token);
        db.user.findOne({
            where: {
                token: req.body.token
            }
        }).then(
            function(user) {
                console.log(user);
                console.log("Before updateAttributes");
                var token = randtoken.generate(16);
                //sendMail(user.email,user.token,"activation");
                user.updateAttributes({
                    password: req.body.password,
                    token: token
                });
                //console.log("Before activated.js");
                req.flash('resetpassword', 'Votre mot de passe a ete reinitialise');

                res.render('log.ejs', {
                    message: req.flash('resetpassword')
                });

            },
            function(e) {
                console.log("error");

            });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    app.post('/login', passport.authenticate('local-login', {

        successRedirect: '/new', // redirect to the secure profile section
        failureRedirect: '/log', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));




    app.post('/uploadProfilePicture', function(req, res) {

        upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.send("Error uploading file.");
        }
        db.user.findOne({
                where: {
                    id: req.user.id
                }
            }).then(function(user) {
                user.updateAttributes({
                    avatar: '../../assets/avatar/'+req.user.email + req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
                });
                res.send({});
            }, function(e) {
                console.log(e);
                res.send(e);

            });
        
        });
        
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('sign.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/signup', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        session: false, // prevent passport from creating session object after signing  up
        failureFlash: true // allow flash messages
    }));


    app.get('/logout', function(req, res) {
        req.session.destroy();
        console.log(req.session);

        // console.log("=============CONTENU DE LA SESSION APRES LA DESTRUCTION=================");
        // console.log(req.session);
        // console.log("=============FIN DU CONTENU DE LA SESSION APRES LA DESTRUCTION=================");

        //req.session = {} ;// Deletes the cookie.

        req.logout();
        res.redirect('/');
    });


    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/new',
            failureRedirect: '/'
        }));



    app.get('/activation/', function(req, res) {
        var token = req.query.token;
        var folderId;
        console.log(token);
        db.user.findOne({
            where: {
                token: token
            }
        }).then(
            function(user) {
                if (user) {
                    console.log("Before updateAttributes");
                    var newtoken = randtoken.generate(16);
                    console.log(newtoken);
                    user.updateAttributes({
                        email_verified: true,
                        token: newtoken
                    });

                    console.log("Creation d u dossier par defaut");
                    //Creation d u dossier par defaut
                    var folder = {
                        name: "Favoris"
                    };
                    db.folder.create(folder).then(
                        function(folder) {
                            folderId = folder.id;
                            user.addFolder(folder);
                        },
                        function(e) {

                        }
                    );

                    console.log("Creation de la note par defaut");
                    var note = {
                        title: "Ma premiere note",
                        content: "Ceci est le contenu de votre premiere note",
                        folder: "Favoris"
                    };
                    db.note.create(note).then(
                        function(note) {

                            db.folder.findOne({
                                where: {
                                    id: folderId
                                }
                            }).then(
                                function(folders) {
                                    folders.addNote(note);
                                    //res.send(note);
                                }
                            )
                        });

                    res.render('activation.ejs');

                } else {
                    res.render('erroractivation.ejs');


                }


            },
            function(e) {
                console.log("error");

            });
    });

}