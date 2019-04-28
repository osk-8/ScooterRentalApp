import React from "react";
import { Route } from "react-router-dom";
import Home from "./Components/Home/";
import Login from "./Components/Login/";
import Registration from "./Components/Registration/";
import VeryfiedRoute from "./Components/VeryfiedRoute";

class App extends React.Component {
  render() {
    return (
      <div>
        {/* for unlogged user */}
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/registration" component={Registration} />

        {/* for logged users */}
        <VeryfiedRoute path="/dashboard" to="/" />
      </div>
    );
  }
}

export default App;
