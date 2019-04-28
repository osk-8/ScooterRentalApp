import React from "react";
import { Link } from "react-router-dom";

class LinkButton extends React.Component {
  render() {
    return <Link to={this.props.path}>{this.props.text}</Link>;
  }
}

export default LinkButton;
