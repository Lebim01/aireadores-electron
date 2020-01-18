import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.global.scss";
import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";
import models from 'models'

// Sync database with Sequelize models
models.sequelize.sync().then(function() {
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

const theme = createMuiTheme({ palette: { type: "light" } });

ReactDOM.render(
  <ReactHotAppContainer>
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" render={props => <AdminLayout {...props} />} />
          <Route path="/auth" render={props => <AuthLayout {...props} />} />
          <Redirect from="/" to="/admin/index" />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  </ReactHotAppContainer>,
  document.getElementById("root")
);
