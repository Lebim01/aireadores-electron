'use strict';
module.exports = (sequelize, DataTypes) => {
  const TimerHistory = sequelize.define('timer_history', {
    start_datetime: DataTypes.STRING,
    end_datetime: DataTypes.STRING
  }, {
    tableName : 'timer_history'
  });
  TimerHistory.associate = (models) => {
		TimerHistory.belongsTo(models.node, {
			foreignKey: 'node_id'
    });
	}
  return TimerHistory;
};