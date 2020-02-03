module.exports = (sequelize, Sequelize) => {
	const Timer = sequelize.define('timer', {
        start_day: {
            type: Sequelize.INTEGER,
            notEmpty: true,
			allowNull: false,
			comment: "day of week"
        },
        start_time: {
            type: Sequelize.STRING(8),
            notEmpty: true,
			allowNull: false,
			comment: "HH:mm:ss"
        },
        end_day : {
            type: Sequelize.INTEGER,
            notEmpty: true,
			allowNull: false,
			comment: "day of week"
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
		Timer.belongsTo(models.node, {
			foreignKey: 'node_id'
        });
	}

	return Timer;
}