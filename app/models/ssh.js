'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ssh = sequelize.define('ssh', {
    ip: DataTypes.STRING,
    port: DataTypes.INTEGER,
    username: DataTypes.STRING,
    key: DataTypes.STRING,
    passphrase: DataTypes.STRING
  }, {
    tableName:'ssh'
  });
  Ssh.associate = function(models) {
    // associations can be defined here
  };
  return Ssh;
};