var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var randtoken = require('rand-token');

module.exports = function(app, passport) {

    app.get('/notedetail/:id', middleware.isLoggedIn, function(req, res) {
        var noteId = req.params.id;
        db.note.findOne({
            where: {
                id: noteId
            }
        }).then(function(note) {
            //console.log(note);
            res.send(note);
        }, function(e) {
            console.log("notedetail error");
            console.log(e);
        });
    });


    app.post('/createnote', middleware.isLoggedIn, function(req, res) {
        db.note.create(_.pick(req.body, 'title', 'content')).then(function(note) {

            db.folder.findOne({
                where: {
                    id: _.pick(req.body, 'folder').folder
                }
            }).then(function(folders) {
                console.log("Nom du dossier", folders);
                folders.addNote(note);
                res.send(note);
            }, function(e) {
                console.log("error");
                console.log(e);

            });



        }, function(e) {

        });


        // res.render('create.ejs', {
        //     user : req.user // get the user out of session and pass to template
        // });
    });


    app.post('/saveChatMessage', middleware.isLoggedIn, function(req, res) {
        console.log(req.body);
        db.chat_message.create(_.pick(req.body, 'message', 'senderEmail', 'senderAvatar')).then(function(chat_message) {

            db.note.findOne({
                where: {
                    id: req.body.noteId
                }
            }).then(function(note) {
                note.addChats(chat_message);
                res.send(note);
            }, function(e) {
                console.log("error");
                console.log(e);

            });



        }, function(e) {

        });


        // res.render('create.ejs', {
        //     user : req.user // get the user out of session and pass to template
        // });
    });


    app.post('/noteSharedByUser', middleware.isLoggedIn, function(req, res) {
        db.shared_note.findAll({
            where: {
                noteOwnerEmail: req.body.userEmail
            },
            include: [{
                model: db.note,
                include: [{
                    model: db.folder,
                    include: [{
                        model: db.user
                    }]
                }]
            }]
        }).then(function(sharenote) {
                res.send(sharenote);
            },
            function(e) {

            });
    });

    app.post('/isNoteShared', middleware.isLoggedIn, function(req, res) {
        db.shared_note.findAll({
            where: {
                noteOwnerEmail: req.body.noteOwnerEmail,
                receiverEmail: req.body.receiverEmail,
                noteId: req.body.noteId
            }
        }).then(function(sharenote) {
                res.send(sharenote);
            },
            function(e) {
              console.log("erreur in route /isNoteShared");
              console.log(e);

            });
    });


    app.post('/noteSharedInformation', function(req, res) {

        db.shared_note.findAll({
            attributes: ['receiverEmail', 'right'],
            where: {
                noteId: req.body.noteId
                //noteId: 'tPpcQvSLuSUu6xmT'
            }
        }).then(function(sharenote) {
                var userData = [];
                var userName=[];
                for (var i = 0; i < sharenote.length; i++) {
                    userData.push(sharenote[i].dataValues);
                    userName.push(sharenote[i].dataValues.receiverEmail);
                }
                console.log("users", userData);

                //res.send(sharenote);
                db.user.findAll({
                  attributes: ['avatar'],
                    where: {
                        email: userName
                    }
                }).then(function(userDetails) {
                  for (var i = 0; i < userName.length; i++) {
                    userData[i].avatar = userDetails[i].dataValues.avatar;
                  }
                  //console.log("userdata",userData);
                        res.send(userData);
                    },
                    function(e) {

                    });
            },
            function(e) {

            });
    });

    app.post('/notesSharedWithUser', middleware.isLoggedIn, function(req, res) {

        db.shared_note.findAll({
            where: {
                receiverEmail: req.body.userEmail
            },
            include: [{
                model: db.note,
                include: [{
                    model: db.folder,
                    include: [{
                        model: db.user
                    }]
                }]
            }]
        }).then(function(sharenote) {
                res.send(sharenote);
            },
            function(e) {

            });
    });


    app.put('/updateNote', middleware.isLoggedIn, function(req, res) {
        db.note.findOne({
            where: {
                id: _.pick(req.body, 'noteId').noteId
            }
        }).then(function(note) {
            note.updateAttributes({
                title: req.body.title,
                content: req.body.content
            });
            res.status(200).send();
        }, function(e) {
            console.log("error");
            console.log(e);

        });

    });

    app.put('/updateNoteFolder/:id', middleware.isLoggedIn, function(req, res) {
        var noteId = req.params.id;
        db.note.findOne({
            where: {
                id: noteId
            }
        }).then(function(note) {
            note.updateAttributes({
                folderId: _.pick(req.body, 'folderId').folderId
            });
            res.status(200).send();
        }, function(e) {
            console.log("error");
            console.log(e);

        });

    });
    app.put('/changeUserNoteRight', middleware.isLoggedIn, function(req, res) {
        //var noteId = req.params.id;
        db.shared_note.findOne({
            where: {
                noteId: req.body.noteId,
                receiverEmail: req.body.receiverEmail
            }
        }).then(function(shared_note) {
            shared_note.updateAttributes({
                right: req.body.right
            });
            res.status(200).send();
        }, function(e) {
            console.log("error in changeUserNoteRight");
            console.log(e);

        });

    });

    app.delete('/deleteUserFromSharingList', middleware.isLoggedIn ,  function(req, res) {
        db.shared_note.destroy({
            where: {
                noteId: req.body.noteId,
                receiverEmail:req.body.receiverEmail
            }
        }).then(function(numberOfRowDeleted) {
            console.log(numberOfRowDeleted);
            //res.send(numberOfRowDeleted);
            res.status(204).send();
        }, function(e) {
          console.log("error in deleteUserFromSharingList");
          console.log(e);
        });
    });

    app.delete('/notedelete/:id', middleware.isLoggedIn, function(req, res) {
        var noteId = req.params.id;
        var folderId;

        db.note.findOne({
            where: {
                id: noteId
            }
        }).then(function(note) {
            console.log(noteId);
            folderId = note.folderId;
            //res.send(note);
        }, function(e) {
            console.log("error");

        }).then(function() {

            db.note.destroy({
                where: {
                    id: noteId
                }
            }).then(function(numberOfRowDeleted) {
                res.send({
                    folder: folderId,
                    notedeleted: true
                });
            }, function(e) {
                console.log("erreur lors de la suppression de la note");
                console.log(e);
                res.send({
                    folder: folderId,
                    notedeleted: false
                });

            });

        }, function(e) {
            console.log("error");
            console.log(e);
        });

    });




    app.get('/notes/:folderId', middleware.isLoggedIn, function(req, res) {
        var folderId = req.params.folderId;
        db.note.findAll({
            where: {
                folderId: folderId
            }
        }).then(function(notes) {
            //console.log(folders);
            res.send(notes);
        }, function(e) {
            console.log("error");

        });
    });


    app.post('/loadChatData', middleware.isLoggedIn, function(req, res) {

        db.chat_message.findAll({
            where: {
                noteId: req.body.noteId
                    //noteId: 'xtlOSw2yHSoXfD5d'
            },
            limit: req.body.limit,
            offset: req.body.offset,
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(function(notes) {
            //console.log(folders);
            res.send(notes);
        }, function(e) {
            console.log("error");

        });
    });

    app.post('/shareNote', middleware.isLoggedIn, function(req, res) {
        //var folderId = req.params.folderId;
        db.note.findOne({
            where: {
                id: req.body.noteId
            }
        }).then(function(note) {

            note.updateAttributes({
                isShared: true
            });

            db.user.findAll({
                where: {
                    email: _.pick(req.body, 'list').list
                }
            }).then(function(users) {
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                    console.log(users);
                    console.log(_.pick(req.body, 'list').list);
                    console.log(_.pick(req.body, 'right').right);
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                    for (var i = 0; i < users.length; i++) {
                        db.shared_note.create({
                            'noteOwnerEmail': req.body.noteOwnerEmail,
                            'right': req.body.right[i],
                            'receiverEmail': users[i].email
                        }).then(function(shareNote) {
                                note.addShared_note(shareNote);
                            },
                            function(e) {
                                console.log("error in promise for shareNote");
                                console.log(e);
                            });

                    }
                    res.send(users);
                },
                function(e) {
                    console.log("error in promise for user");
                    console.log(e);
                });

        }, function(e) {
            console.log("error in promise for note");
            console.log(e);

        });

    });


    app.post('/notesearch', middleware.isLoggedIn, function(req, res) {

        //var search = req.params.search;
        var search = _.pick(req.body, 'keyword').keyword;
        var email = _.pick(req.body, 'email').email;
        var account = _.pick(req.body, 'account').account;
        if (account == "local") {
            db.note.findAll({
                where: {

                    $or: [{
                        title: {
                            $like: '%' + search + '%'
                        }
                    }, {
                        content: {
                            $like: '%' + search + '%'
                        }
                    }]

                },
                include: [{
                    model: db.folder,
                    require: true,
                    where: {
                        id: {
                            $ne: null
                        } //,
                        //id:req.user.id
                    },
                    include: [{
                        model: db.user,
                        where: {
                            email: email
                        }
                    }]
                }, ]
            }).then(function(note) {
                res.send(note);
            }, function(e) {
                console.log(e);
                console.log("error");

            });

        } else {
            db.note.findAll({
                where: {

                    $or: [{
                        title: {
                            $like: '%' + search + '%'
                        }
                    }, {
                        content: {
                            $like: '%' + search + '%'
                        }
                    }]

                },
                include: [{
                    model: db.folder,
                    require: true,
                    where: {
                        id: {
                            $ne: null
                        } //,
                        //id:req.user.id
                    },
                    include: [{
                        model: db.user_fcbk,
                        where: {
                            email: email
                        }
                    }]
                }, ]
            }).then(function(note) {
                res.send(note);
            }, function(e) {
                console.log(e);
                console.log("error");

            });

        }

    });

};
