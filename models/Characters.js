module.exports = (sequelize, DataTypes) => {
	return sequelize.define('characters', {
		id : {
			type : DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull : false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		age: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};