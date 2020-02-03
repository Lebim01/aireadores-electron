'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pool = sequelize.define('pool', {
    name: DataTypes.STRING
  }, {
    tableName : 'pool'
  });
  Pool.associate = (models) => {
		Pool.hasMany(models.node, {
      foreignKey: 'pool_id'
    });
	}
  return Pool;
};