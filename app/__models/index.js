import path from 'path'
import fs from 'fs'
import Sequelize from 'sequelize';
import databaseConfig from 'config/database.json'

const config = databaseConfig.development
const env = process.env.NODE_ENV || "development";
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

const dirModels = path.join(__dirname, 'models')

fs
	.readdirSync(dirModels)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		let model = sequelize.import(path.join(dirModels, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) db[modelName].associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;