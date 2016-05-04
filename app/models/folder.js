module.exports = function(sequelize, DataTypes) {
	return sequelize.define('folder', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}
	});
};