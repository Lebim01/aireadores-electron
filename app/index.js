import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import models from 'models'
import App from './App'

// Sync database with Sequelize models
models.sequelize.sync({ force: true }).then(function() {
	if (process.env.NODE_ENV !== "test") {
		console.log('Database connected!');
  }
  return models.ssh.create({
    ip : '',
    port : 22,
    username : '',
    key : ''
  })
}).catch(function(err) {
	console.error(err, "Something went wrong, database is not connected!");
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById("root")
);
