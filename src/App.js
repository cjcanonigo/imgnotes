import React, { Component } from "react";
import "./App.css";
import Images from "./components/Images";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { MuiThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import Logo from "./RBXIcon.svg";

// https://material-ui.com/style/color/
const theme = createMuiTheme({
  palette: {
    primary: { main: "#00A2FF" },
    secondary: { main: "#FFFFFF" }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <AppBar position="static" color="primary">
            <Toolbar>
              <img src={Logo} style={{ padding: 16 }} />
              <Typography variant="title" color="secondary">
                Roblox Ad Approval
              </Typography>
            </Toolbar>
          </AppBar>
          <Images />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
