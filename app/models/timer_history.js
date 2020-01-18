module.exports = (sequelize, Sequelize) => {
	const TimerHistory = sequelize.define('timer_history', {
        start_datetime: {
            type: Sequelize.STRING(19),
            notEmpty: true,
			allowNull: false,
			comment: "YYYY-MM-DD HH:mm:ss"
        },
        end_datetime: {
            type: Sequelize.STRING(19),
            notEmpty: true,
			allowNull: false,
			comment: "YYYY-MM-DD HH:mm:ss"
        },
	}, {
        tableName: 'timer_history',
	});

	TimerHistory.associate = (models) => {
		TimerHistory.hasMany(models.node, {
			foreignKey: 'node_id'
        });
	}

	return TimerHistory;
}