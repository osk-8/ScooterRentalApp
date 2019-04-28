import React from "react";
import Navbar from "../Navbar/UnloggedNav";
import RegistrationForm from "./RegistrationForm";
import styles from "./Registration.module.css";

class Registration extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles["registration-navbar"]}>
          <Navbar />
        </div>
        <div className={styles["registration-form"]}>
          <h1>Registration</h1>
          <RegistrationForm />
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
