import React from "react";
import axios from "axios";

import PrepaidForm from "./PrepaidForm";
import AddCardForm from "./AddCardForm";
import DeleteCreditCardButton from "./DeleteCreditCardButton";
import styles from "./Wallet.module.css";

class Wallet extends React.Component {
  state = { isCardAdded: null, balance: null };

  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/checkCard",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    }).then(response => {
      if (response.data) {
        if (response.data.isCardAdded === "true")
          this.setState({
            isCardAdded: true
          });
        else
          this.setState({
            isCardAdded: false
          });
      }
    });

    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/getBalance",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(response => {
        if (response.data) {
          this.setState({
            balance: response.data.balance
          });
        }
      })
      .catch(error => {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      });
  }

  handleCardAdding = () => {
    this.setState({
      isCardAdded: true
    });
  };

  handleCreditCardRemove = () => {
    this.setState({
      isCardAdded: false
    });
  };

  handlePrepaid = newBalance => {
    const balance = this.addTwoAmounts(this.state.balance, newBalance);
    this.setState({
      balance: balance
    });
  };

  addTwoAmounts = (first, second) => {
    const sum =
      (
        parseFloat(first.replace(",", ".")) +
        parseFloat(second.replace(",", "."))
      )
        .toFixed(2)
        .toString()
        .replace(".", ",") + " zł";

    return sum;
  };

  render() {
    return (
      <React.Fragment>
        <h1 className={styles["wallet-balance-header"]}>Wallet balance:</h1>
        <h1 className={styles["wallet-balance-amount"]}>
          {this.state.balance}
        </h1>
        {this.state.isCardAdded ? (
          <React.Fragment>
            <div className={styles["wallet-prepaid-form"]}>
              <h3 className={styles["wallet-info-card"]}>
                Transfer money from your credit card to wallet
              </h3>
              <PrepaidForm handlePrepaid={this.handlePrepaid} />
            </div>
            <div className={styles["wallet-delete-card"]}>
              <h3>Remove the credit card from your wallet</h3>
              <DeleteCreditCardButton
                handleCreditCardRemove={this.handleCreditCardRemove}
              />
            </div>
          </React.Fragment>
        ) : (
          <div className={styles["wallet-add-card-form"]}>
            <h3 className={styles["wallet-info-card"]}>Add your credit card</h3>
            <AddCardForm handleCardAdding={this.handleCardAdding} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Wallet;
