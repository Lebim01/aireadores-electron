import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import models from 'models'
import App from './App'
import history_dump from 'views/timer_history_dump'

// Sync database with Sequelize models
models.sequelize.sync({ force: process.env.NODE_ENV === 'development' }).then(function() {
	if (process.env.NODE_ENV !== "test") {
		console.log('Database connected!');
  }
  return models.ssh.create({
    ip : '',
    port : 22,
    username : '',
    key : ''
  })
})
.then(() => {
  return models.pool.create({
    name : 'piscina 1'
  })
})
.then(() => {
  return models.node.create({
    address : '127.0.0.1',
    channel : '12',
    num : 2,
    pool_id : 1,
    status : 'apagado',
    rssi : 111
  })
})
.then(() => {
  return models.timer_history.bulkCreate(history_dump)
})
.catch(function(err) {
	console.error(err, "Something went wrong, database is not connected!");
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById("root")
);
