module.exports = (sequelize, DataTypes) => {
	return sequelize.define('works', {
		role_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		channel_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pay: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue : 0,
		},
	}, {
		timestamps: false,
	});
};