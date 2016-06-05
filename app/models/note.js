var randtoken = require('rand-token');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('note', {
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