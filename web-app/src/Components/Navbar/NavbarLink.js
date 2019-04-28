import React from "react";
import { Link } from "react-router-dom";

class NavbarLink extends React.Component {
  render() {
    return (
      <Link to={this.props.path} onClick={this.props.handleClick}>
        {this.props.text}
      </Link>
    );
  }
}

export default NavbarLink;
