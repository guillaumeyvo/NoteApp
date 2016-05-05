var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email   = require("emailjs/email");
var randtoken = require('rand-token');


module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });


    app.get('/log', function(req, res) {
        res.render('log.ejs'); // load the index.ejs file
    });



    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.get('/forgotpassword', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('forgotpassword.ejs', { message: req.flash('Message') }); 
    });

    app.post('/forgotpassword', function(req, res) {

        var email = req.body.email;
        db.user.findOne({
            where:{
                email:email
            }}).then(
            function(user){
                var token = randtoken.generate(16);
                req.flash('forgot', 'Check your email');
                user.updateAttributes({
                    token : token
                });
                sendMail(user.email,token,"reset");
                //console.log("Before activated.js");
        res.render('forgotpassword.ejs', { message: req.flash('forgot') }); 
               
            },
            function(e){
                        console.log("error");
                        console.log(e);
                        req.flash('forgot', 'An error has occured');
                        res.render('forgotpassword.ejs', { message: req.flash('forgot') }); 


            });
         
    });


    app.get('/resetpassword/', function(req, res) {

        // render the page and pass in any flash data if it exists
        var token = req.query.token;
        console.log(token);
        res.render('resetpassword.ejs', { message: req.flash('Message'),token:token }); 
    });


    app.post('/resetpassword', function(req, res) {
    var token = req.query.token;
    console.log("token",token);
        db.user.findOne({
            where:{
                token:req.body.token
            }}).then(
            function(user){
                console.log(user);
                console.log("Before updateAttributes");
                var token = randtoken.generate(16);
                //sendMail(user.email,user.token,"activation");
                user.updateAttributes({
                    password : req.body.password,
                    token: token
                });
                //console.log("Before activated.js");
                req.flash('resetpassword', 'Your password has been reset');

                res.render('login.ejs', { message: req.flash('resetpassword') }); 
               
            },
            function(e){
                        console.log("error");

            });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/new', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


  



    app.get('/create',isLoggedIn, function(req, res) {
        res.render('create.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    app.get('/mynotes',isLoggedIn, function(req, res) {
        db.folder.findAll({
            where:{
                userId:req.user.id
            },
        include: [
            { model: db.note }, // load all pictures
          ]
        }).then(function(data){
                console.log(data[0].id);
                console.log(data[0].name);
                console.log(data[0].notes[1]);
                
                //console.log(data.length);
                /*for(var i =0;i<data.length;i++)
                {
                    console.log()
                }*/
               //res.send(data);
               res.render('notes.ejs', {
                    user : req.user,
                    data:data 
                });
            },
                function(e){
                    console.log("error");
                    console.log(e);

                });

    });

        app.get('/new',isLoggedIn, function(req, res) {
            console.log("=============CONTENU DE LA SESSION=================");
        console.log(req.user);
        console.log("=============FIN DU CONTENU DE LA SESSION=================");

        if(req.user.account_type=="local"){
            db.folder.findAll({
            where:{
                userId:req.user.id
            },
        include: [
            { model: db.note }, // load all pictures
          ]
        }).then(function(data){
             
               res.render('main.ejs', {
                    user : req.user,
                    avatar:req.user.avatar,
                    email:req.user.email,
                    data:data 
                });
            },
                function(e){
                    console.log("error");
                    console.log(e);

                });



        }
        else{

            db.folder.findAll({
            where:{
                userFcbkId:req.user.id
            },
        include: [
            { model: db.note }, // load all pictures
          ]
        }).then(function(data){
               res.render('main.ejs', {
                    user : req.user,
                    avatar:req.user.avatar,
                    email:req.user.email,
                    data:data 
                });
            },
                function(e){
                    console.log("error");
                    console.log(e);

                });

        }




        

    });

    app.post('/createnote',isLoggedIn, function(req, res) {
        db.note.create(_.pick(req.body, 'title', 'content')).then(function(note){
            
            db.folder.findOne({
            where:{
                id:_.pick(req.body, 'folder').folder
            }}).then(function(folders){
                console.log("Nom du dossier",folders);
                folders.addNote(note);
                 res.send(note);
            },function(e){
                        console.log("error");
                        console.log(e);

            });

          

        },function(e){

        });
        
         
        // res.render('create.ejs', {
        //     user : req.user // get the user out of session and pass to template
        // });
    });


    app.get('/folders', function(req, res) {
        console.log("folders");
        if(req.user.account_type=="local"){
            db.folder.findAll({
            where:{
                userId:req.user.id
            }}).then(function(folders){
                //console.log(folders);
               res.send(folders);
            },function(e){
                        console.log("error");

            });
        }
        else{
            db.folder.findAll({
            where:{
                userFcbkId:req.user.id
            }}).then(function(folders){
                //console.log(folders);
               res.send(folders);
            },function(e){
                        console.log("error");

            });

        }
        
    });

    app.get('/foldersandnotes', function(req, res) {
        console.log("folders");
        db.folder.findAll({
            where:{
                userId:2
            },
        include: [
            { model: db.note }, // load all pictures
          ]
        }).then(function(data){
                console.log(data[0].id);
                console.log(data[0].name);
                console.log(data[0].notes[1]);
                
                //console.log(data.length);
                /*for(var i =0;i<data.length;i++)
                {
                    console.log()
                }*/
               res.send(data);
            },
                function(e){
                    console.log("error");
                    console.log(e);

                });
    });


    app.get('/notedetail/:id', function(req, res) {
    var noteId = parseInt(req.params.id, 10);
        db.note.findOne({
            where:{
                id:noteId
            }}).then(function(note){
                console.log(note);
               res.send(note);
            },function(e){
                        console.log("error");

            });
    });


    app.get('/activation/', function(req, res) {
    var token = req.query.token;
    var folderId;
    console.log(token);
        db.user.findOne({
            where:{
                token:token
            }}).then(
            function(user){
                console.log("Before updateAttributes");
                user.updateAttributes({
                    email_verified : true
                });

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

                res.render('activated.ejs');
               
            },
            function(e){
                console.log("error");

            });
    });

   

    app.get('/notesearch/:search', function(req, res) {
    var search = req.params.search;
        db.note.findAll({
            where:{
                
                  $or: [
                    {
                      title: {
                        $like: '%'+search+'%'
                      }
                    },
                    {
                      content: {
                        $like: '%'+search+'%' 
                      }
                    }
                  ]

            }}).then(function(note){
                console.log(note);
               res.send(note);
            },function(e){
                        console.log("error");

            });
    });

    app.put('/updateNote',isLoggedIn, function(req, res){
        db.note.findOne({
            where :{
                id :_.pick(req.body, 'noteId').noteId
            }
        }).then(function(note){
            note.updateAttributes({
                title:req.body.title,
                content:req.body.content
            });
            res.status(200).send();
        },function(e){
                        console.log("error");
                        console.log(e);

            });

    });

    app.delete('/notedelete/:id', function(req, res) {
        var noteId = parseInt(req.params.id, 10);
        var folderId;

        db.note.findOne({
                where:{
                    id:noteId
                }}).then(function(note){
                    console.log(noteId);
                    folderId = note.folderId;
                   //res.send(note);
                },function(e){
                            console.log("error");

                }).then(function(){

                    db.note.destroy({
                where:{
                    id:noteId
                }}).then(function(numberOfRowDeleted){
                    res.send({folder : folderId, notedeleted :true });
                },function(e){
                    console.log("erreur lors de la suppression de la note");
                    console.log(e);
                    res.send({folder : folderId, notedeleted :false });

                });

                },function(e){
                    console.log("error");
                    console.log(e);
                });
  
    });

    app.delete('/folderDelete/:id', function(req, res) {
    var folderId = parseInt(req.params.id, 10);
        db.folder.destroy({
            where:{
                id:folderId
            }}).then(function(numberOfRowDeleted){
                console.log(numberOfRowDeleted);
               //res.send(numberOfRowDeleted);
               res.status(204).send();
            },function(e){
                        console.log("error");

            });
    });


    app.delete('/folderDeleteByName/:folderName', function(req, res) {
    var folderName = req.params.folderName;
        db.folder.destroy({
            where:{
                name:folderName
            }}).then(function(numberOfRowDeleted){
                console.log(numberOfRowDeleted);
               //res.send(numberOfRowDeleted);
               res.status(204).send();
            },function(e){
                        console.log("error");

            });
    });

    app.get('/notes/:folderId', function(req, res) {
    var folderId = parseInt(req.params.folderId, 10);
        db.note.findAll({
            where:{
                folderId:folderId
            }}).then(function(notes){
                //console.log(folders);
               res.send(notes);
            },function(e){
                        console.log("error");

            });
    });



    app.post('/folders', function(req, res) {
        console.log(req.body);
         db.folder.create(req.body).then(function(folder){
            req.user.addFolder(folder);

            res.send(folder);

        },function(e){

        });
        
    });


    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/new',
            failureRedirect : '/'
        }));



        app.post('/profile', isLoggedIn, function(req, res) {
        console.log("req.folder",req.body.folder);
        db.folder.create({
            name: req.body.folder
        }).then(function(folder){
            req.user.addFolder(folder);

            res.render('profile.ejs', {
            user : req.user,folder :folder // get the user out of session and pass to template
        });

        },function(e){

        });
        ;
        
    });


      app.get('/profile', isLoggedIn, function(req, res) {
        console.log("=============CONTENU DE LA SESSION=================");
        console.log(req.session);
        console.log("=============FIN DU CONTENU DE LA SESSION=================");

        db.folder.findAll({
            where:{
                userId:req.user.id
            }}).then(function(folders){
                res.render('profile.ejs',{user: req.user,folder:folders})
            },function(e){
                console.log(e);

            });
    });


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

function sendMail(user_email,user_token,type) {
    var server  = email.server.connect({
           user:    "guillaumeyvo", 
           password:"guiz@08080636", 
           host:    "smtp.gmail.com", 
           ssl:     true
        });
    var mailcontent;

    if(type =="activation")
        mailcontent ="Cliquez sur le lien suivant pour achever la creation de votre compte <a href='http://localhost:8080/activation/?token="+user_token+"'>Activate your account</a> ";
    else
        mailcontent ="Cliquez sur le lien suivant pour reinitialiser votre mot de passe <a href='http://localhost:8080/resetpassword/?token="+user_token+"'>Reset your password</a> ";
        // send the message and get a callback with an error or details of the message that was sent
        server.send({
           from:    "nodeapp@gmail.com", 
           to:      user_email,
           subject: "Emailjs",
           attachment: 
           [
              {data:mailcontent, alternative:true},
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