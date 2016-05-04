module.exports = function(sequelize, DataTypes) {
	return sequelize.define('note', {
		content: {
			type: DataTypes.STRING,
			allowNull: false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
};