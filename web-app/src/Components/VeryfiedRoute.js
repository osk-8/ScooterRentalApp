import React from "react";
import Dashboard from "./Dashboard/";
import { Route, Redirect } from "react-router-dom";

class VeryfiedRoute extends React.Component {
  render() {
    return (
      <div>
        {localStorage.getItem("userToken") ? (
          <Route path={this.props.path} component={Dashboard} />
        ) : (
          <Redirect to={this.props.to} />
        )}
      </div>
    );
  }
}

export default VeryfiedRoute;
