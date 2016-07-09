var randtoken = require('rand-token');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('chat', {
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		senderEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		senderAvatar: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};