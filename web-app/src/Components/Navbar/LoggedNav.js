import React from "react";
import NavbarLink from "./NavbarLink";
import styles from "./LoggedNav.module.css";

class Navbar extends React.Component {
  removeToken = () => {
    localStorage.removeItem("userToken");
  };

  render() {
    return (
      <React.Fragment>
        <nav className={styles["navbar"]}>
          <div className={styles["nav-logo"]}>
            <h1>RIDE.</h1>
          </div>
          <div className={styles["navbar-buttons"]}>
            <div className={styles["nav-links"]}>
              <NavbarLink
                path="/"
                text="Logout"
                handleClick={this.removeToken}
              />
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default Navbar;
