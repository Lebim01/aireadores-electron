'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'node', // name of Source model
      'pool_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'pool', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'node', // name of Source model
      'pool_id' // key we want to remove
    )
  }
};
