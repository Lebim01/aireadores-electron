'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'timer', // name of Source model
      'node_id', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'node', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'timer', // name of Source model
      'node_id' // key we want to remove
    )
  }
};
