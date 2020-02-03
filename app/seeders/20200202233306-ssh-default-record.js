module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('ssh', [{
      ip : '',
      port : 22,
      username : '',
      key : '',
      passphrase : '',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ssh', null, {});
  }
};