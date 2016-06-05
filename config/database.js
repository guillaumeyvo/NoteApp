//module.exports = {
//
//    'url' : 'mongodb://localhost:27017/test' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
//
//};
var path 	 = require('path');
global.appRoot = path.resolve(__dirname);
var Sequelize = require('sequelize');
var appDir = path.dirname(require.main.filename);
//var env = process.env.NODE_ENV || 'development';
var sequelize;


sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': appDir + '/app/data/userdb.sqlite'
	});

var db = {};


db.user = sequelize.import(appDir + '/app/models/user.js');
db.folder = sequelize.import(appDir + '/app/models/folder.js');
db.note = sequelize.import(appDir + '/app/models/note.js');
db.chat_message = sequelize.import(appDir + '/app/models/chat_message.js');
db.shared_note = sequelize.import(appDir + '/app/models/shared_note.js');
db.user_fcbk = sequelize.import(appDir + '/app/models/user_fcbk.js');

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.folder.belongsTo(db.user);
db.user.hasMany(db.folder);

db.folder.belongsTo(db.user_fcbk);
db.user_fcbk.hasMany(db.folder);

db.note.belongsTo(db.folder);
db.folder.hasMany(db.note);

db.shared_note.belongsTo(db.note);
db.note.hasMany(db.shared_note);

db.chat_message.belongsTo(db.note);
db.note.hasMany(db.chat_message);

module.exports = db;