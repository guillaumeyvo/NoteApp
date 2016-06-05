var randtoken = require('rand-token');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('folder', {
		id: {
		    type: DataTypes.UUID,
		    defaultValue: function() {
		    	var uid = require('rand-token').uid;
	            var id = uid(16);
		      return id;
		    },
		    primaryKey: true,
		    allowNull: false 
	  	},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		}
	});
};