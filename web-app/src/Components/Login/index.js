import React from "react";
import Navbar from "../Navbar/UnloggedNav";
import LoginForm from "./LoginForm";
import styles from "./Login.module.css";

class Login extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles["login-navbar"]}>
          <Navbar />
        </div>
        <div className={styles["login-form"]}>
          <h1>Login</h1>
          <LoginForm />
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
