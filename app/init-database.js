const sqlite3 = require('sqlite3').verbose();
const config = require('./config/config')
const shell = require('shelljs');

let db = new sqlite3.Database(config.development.storage, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) { 
        console.log('Error when creating the database', err) 
    } else { 
        console.log('Database created!') 

        shell.exec('npx sequelize-cli db:migrate')
        shell.exec('npx sequelize-cli db:seed:all')
        db.close();
    } 
});