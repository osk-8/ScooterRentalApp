import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import styles from "./Edit.module.css";

class DeleteProfileButton extends React.Component {
  state = {
    fireRedirect: false
  };

  handleClick = () => {
    axios({
      method: "delete",
      url: "http://pascal.fis.agh.edu.pl:1777/deleteUser",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(response => {
        localStorage.removeItem("userToken");
        this.setState({
          fireRedirect: true
        });
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  render() {
    return (
      <React.Fragment>
        <button
          className={styles["edit-delete-button"]}
          onClick={this.handleClick}
        >
          Delete profile
        </button>
        {this.state.fireRedirect && <Redirect to="/" />}
      </React.Fragment>
    );
  }
}

export default DeleteProfileButton;
