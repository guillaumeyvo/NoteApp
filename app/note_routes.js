var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var randtoken = require('rand-token');

module.exports = function(app, passport) {

    app.get('/notedetail/:id', function(req, res) {
        var noteId = parseInt(req.params.id, 10);
        db.note.findOne({
            where: {
                id: noteId
            }
        }).then(function(note) {
            console.log(note);
            res.send(note);
        }, function(e) {
            console.log("error");

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

    app.delete('/notedelete/:id', function(req, res) {
        var noteId = parseInt(req.params.id, 10);
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




    app.get('/notes/:folderId', function(req, res) {
        var folderId = parseInt(req.params.folderId, 10);
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


    app.post('/notesearch', function(req, res) {
        console.log("=========================");
        console.log(req.isAuthenticated());
        console.log(req.body);
        //_.pick(req.body, 'folder').folder
        console.log(_.pick(req.body, 'email').email);
        console.log(_.pick(req.body, 'keyword').keyword);
        console.log(_.pick(req.body, 'account').account);

        console.log("=========================");
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
                console.log("/////////////////////////////////////////////////////////");
                console.log(note.dataValues);
                console.log("/////////////////////////////////////////////////////////");
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
                console.log("/////////////////////////////////////////////////////////");
                console.log(note);
                console.log("/////////////////////////////////////////////////////////");
                res.send(note);
            }, function(e) {
                console.log(e);
                console.log("error");

            });

        }

    });

};
