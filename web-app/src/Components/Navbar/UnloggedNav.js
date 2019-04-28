import React from "react";

import styles from "./UnloggedNav.module.css";
import NavbarLink from "./NavbarLink";

class Navbar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <nav className={styles["navbar"]}>
          <div className={styles["nav-logo"]}>
            <h1>RIDE.</h1>
          </div>
          <div className={styles["navbar-buttons"]}>
            <div className={styles["nav-links"]}>
              <NavbarLink path="/" text="Home" />
            </div>
            <div className={styles["nav-links"]}>
              <NavbarLink path="/login" text="Sign in" />
            </div>
            <div className={styles["nav-links"]}>
              <NavbarLink path="/registration" text="Sign up" />
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Navbar;
