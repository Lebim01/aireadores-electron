'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('timer', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('timer');
  }
};