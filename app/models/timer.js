'use strict';
module.exports = (sequelize, DataTypes) => {
  const Timer = sequelize.define('timer', {
    start_day: DataTypes.INTEGER,
    start_time: DataTypes.STRING,
    end_day: DataTypes.INTEGER,
    end_time: DataTypes.STRING
  }, {
    tableName:'timer'
  });
  Timer.associate = (models) => {
		Timer.belongsTo(models.node, {
			foreignKey: 'node_id'
    });
}
  return Timer;
};