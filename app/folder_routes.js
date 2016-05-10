var db = require('../config/database.js');
var middleware = require('../app/middleware.js');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var email = require("emailjs/email");
var randtoken = require('rand-token');

module.exports = function(app, passport) {
    app.get('/folders', function(req, res) {
        console.log("folders");
        if (req.user.account_type == "local") {
            db.folder.findAll({
                where: {
                    userId: req.user.id
                }
            }).then(function(folders) {
                //console.log(folders);
                res.send(folders);
            }, function(e) {
                console.log("error");

            });
        } else {
            db.folder.findAll({
                where: {
                    userFcbkId: req.user.id
                }
            }).then(function(folders) {
                //console.log(folders);
                res.send(folders);
            }, function(e) {
                console.log("error");

            });

        }

    });




    app.delete('/folderDelete/:id', function(req, res) {
        var folderId = parseInt(req.params.id, 10);
        console.log(folderId);
        db.folder.destroy({
            where: {
                id: folderId
            }
        }).then(function(numberOfRowDeleted) {
            console.log(numberOfRowDeleted);
            //res.send(numberOfRowDeleted);
            res.status(204).send();
        }, function(e) {
            console.log(e);
            console.log("error");

        });
    });


    app.delete('/folderDeleteByName/:folderName', function(req, res) {
        var folderName = req.params.folderName;
        db.folder.destroy({
            where: {
                name: folderName
            }
        }).then(function(numberOfRowDeleted) {
            console.log(numberOfRowDeleted);
            //res.send(numberOfRowDeleted);
            res.status(204).send();
        }, function(e) {
            console.log("error");

        });
    });



    app.post('/folders', function(req, res) {
        console.log(req.body);
        db.folder.create(req.body).then(function(folder) {
            req.user.addFolder(folder);

            res.send(folder);

        }, function(e) {

        });

    });
}