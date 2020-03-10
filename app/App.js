import React from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.global.scss";
import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";
import { hot } from "react-hot-loader/root";
import monitor from 'helpers/monitor-nodes-status'

monitor()
const theme = createMuiTheme();

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/admin" render={props => <AdminLayout {...props} />} />
                    <Route path="/auth" render={props => <AuthLayout {...props} />} />
                    <Redirect from="/" to="/admin/nodos" />
                </Switch>
            </BrowserRouter>
        </MuiThemeProvider>
    )
}

export default hot(App)