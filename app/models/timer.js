module.exports = (sequelize, Sequelize) => {
	const Timer = sequelize.define('timer', {
        start_day: {
            type: Sequelize.STRING(10),
            notEmpty: true,
			allowNull: false,
			comment: "YYYY-MM-DD"
        },
        start_time: {
            type: Sequelize.STRING(8),
            notEmpty: true,
			allowNull: false,
			comment: "HH:mm:ss"
        },
        end_day : {
            type: Sequelize.STRING(10),
            notEmpty: true,
			allowNull: false,
			comment: "YYYY-MM-DD"
        },
        end_time : {
            type: Sequelize.STRING(8),
            notEmpty: true,
			allowNull: false,
			comment: "HH:mm:ss"
        },
	}, {
        tableName: 'timer',
	});

	Timer.associate = (models) => {
		Timer.hasMany(models.node, {
			foreignKey: 'node_id'
        });
	}

	return Timer;
}