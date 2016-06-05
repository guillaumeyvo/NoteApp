var randtoken = require('rand-token');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shared_note', {
		noteOwnerEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		receiverEmail: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};