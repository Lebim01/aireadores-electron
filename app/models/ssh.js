module.exports = (sequelize, Sequelize) => {
	const Ssh = sequelize.define('ssh', {
        ip: {
            type: Sequelize.STRING,
			comment: "IP"
        },
        port: {
            type: Sequelize.INTEGER,
			comment: "port"
        },
        username : {
            type: Sequelize.STRING,
			comment: "user"
        },
        key : {
            type: Sequelize.STRING,
			comment: "path to private ssh key"
        },
	}, {
        tableName: 'ssh',
	});

	return Ssh;
}