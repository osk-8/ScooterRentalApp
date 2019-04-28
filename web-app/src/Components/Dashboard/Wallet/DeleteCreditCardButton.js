import React from "react";
import axios from "axios";

import styles from "./Wallet.module.css";

class DeleteCreditCardButton extends React.Component {
  handleClick = () => {
    axios({
      method: "delete",
      url: "http://pascal.fis.agh.edu.pl:1777/removeCreditCard",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(response => {
        return this.props.handleCreditCardRemove();
      })
      .catch(error => {
        alert(error.response.data.message);
      });
  };

  render() {
    return (
      <button
        className={styles["wallet-delete-button"]}
        onClick={this.handleClick}
      >
        remove credit card
      </button>
    );
  }
}

export default DeleteCreditCardButton;
