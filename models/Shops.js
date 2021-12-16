module.exports = (sequelize, DataTypes) => {
	return sequelize.define('shops', {
		id : {
			type : DataTypes.UUIDV4,
		},
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};