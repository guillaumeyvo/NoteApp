var bcrypt   = require('bcrypt-nodejs');



module.exports = function(sequelize, DataTypes) {
	var user= sequelize.define('User', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},password_hash: {
			type: DataTypes.STRING
		},account_type: {
			type: DataTypes.STRING
		},avatar: {
			type: DataTypes.STRING
		},
		email_verified: {
			type: DataTypes.BOOLEAN
		},token: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				//this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	},{
    classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});
				});
			}

		}
    });
    return user;
	
};

//===========================================================


