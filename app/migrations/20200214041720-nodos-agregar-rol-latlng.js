'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(
        'node',
        'longitude',
        {
          type: Sequelize.DataTypes.NUMBER,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'node',
        'latitude',
        {
          type: Sequelize.DataTypes.NUMBER,
        },
        { transaction }
      );

      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.removeColumn(
        'node',
        'longitude',
        { transaction }
      );

      await queryInterface.removeColumn(
        'node',
        'latitude',
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
