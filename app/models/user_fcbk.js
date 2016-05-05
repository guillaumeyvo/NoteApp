module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user_fcbk', {
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		avatar: {
			type: DataTypes.STRING,
			allowNull: false
		},
		account_type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		}
	});
};