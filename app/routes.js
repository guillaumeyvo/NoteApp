var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var randtoken = require('rand-token');


module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================



    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });



    app.get('/log', function(req, res) {
        console.log("Inside /login");
        console.log(req.flash);
        console.log("PROCESS PORT", process.env.PORT);
        res.render('log.ejs', {
            message: req.flash('loginMessage')
        }); // load the index.ejs file
    });

    app.get('/sign', function(req, res) {
        res.render('sign.ejs'); // load the index.ejs file
    });
    app.get('/reset', function(req, res) {
        res.render('reset.ejs'); // load the index.ejs file
    });




    // =====================================
    // HOME PAGE ===============================
    // =====================================
    // show the login form

    app.get('/new', middleware.isLoggedIn, function(req, res) {
        //     console.log("=============CONTENU DE LA SESSION=================");
        // console.log(req.user);
        // console.log("=============FIN DU CONTENU DE LA SESSION=================");

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
                    console.log("$$$$$$$$$$$$$$$$$$$$$$");
                   console.log(data);
                   console.log("$$$$$$$$$$$$$$$$$$$$$$");

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
    });




};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // console.log("=============================");
    // console.log(req);
    // console.log("=============================");
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function sendMail(user_email, user_token, type) {
    var server = email.server.connect({
        user: "guillaumeyvo",
        password: "guiz@08080636",
        host: "smtp.gmail.com",
        ssl: true
    });
    var mailcontent;

    if (type == "activation")
        mailcontent = "Cliquez sur le lien suivant pour achever la creation de votre compte <a href='http://localhost:8080/activation/?token=" + user_token + "'>Activate your account</a> ";
    else
        mailcontent = "Cliquez sur le lien suivant pour reinitialiser votre mot de passe <a href='http://localhost:8080/resetpassword/?token=" + user_token + "'>Reset your password</a> ";
    // send the message and get a callback with an error or details of the message that was sent
    server.send({
        from: "nodeapp@gmail.com",
        to: user_email,
        subject: "Emailjs",
        attachment: [{
            data: mailcontent,
            alternative: true
        }, ]
    }, function(err, message) {
        console.log(err || message);
        if (err) {
            console.log(err || message);
        } else {
            //res.render('index.ejs', {message : message}); // load the index.ejs file

            //next();

        }
    });
    //}


}