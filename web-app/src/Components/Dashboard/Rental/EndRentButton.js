import React from "react";
import axios from "axios";

import styles from "./Rental.module.css";

class EndRentButton extends React.Component {
  handleClick = event => {
    event.preventDefault();

    if (this.props.position) {
      axios({
        method: "post",
        url: "http://pascal.fis.agh.edu.pl:1777/endRental",
        data: {
          scooterId: this.props.scooterId,
          lat: this.props.position.lat.toString(),
          lng: this.props.position.lng.toString()
        },
        headers: {
          "x-access-token": localStorage.getItem("userToken")
        }
      })
        .then(response => {
          if (response.data) {
            return this.props.endRental();
          }
        })
        .catch(error => {
          if (error.response) {
            alert(error.response.data.message);
          }
        });
    }
  };

  render() {
    return (
      <button className={styles["rent-button"]} onClick={this.handleClick}>
        Click to finish rental
      </button>
    );
  }
}

export default EndRentButton;
