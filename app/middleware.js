var email = require("emailjs/email");


module.exports = {

        sendMail: function(mail) {
            return function(req, res, next) {
                console.log("VVVVVVVVVVVVVVVVV")
                console.log(mail);
                var server = email.server.connect({
                    user: "guillaumeyvo",
                    password: "guiz@08080636",
                    host: "smtp.gmail.com",
                    ssl: true
                });

                // send the message and get a callback with an error or details of the message that was sent
                server.send({
                    from: "nodeapp@gmail.com",
                    to: "guillaumeyvo@yahoo.fr",
                    subject: "Emailjs",
                    attachment: [{
                        data: " <a href='http://www.w3schools.com/html/'>Visit our HTML tutorial</a> ",
                        alternative: true
                    }, ]
                }, function(err, message) {
                    console.log(err || message);
                    if (err) {
                        console.log(err || message);
                    } else {
                        //res.render('index.ejs', {message : message}); // load the index.ejs file

                        next();

                    }
                });
            }

        },
         isLoggedIn: function(req, res, next) {
    // console.log("=============================");
    // console.log(req);
    // console.log("=============================");
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



};