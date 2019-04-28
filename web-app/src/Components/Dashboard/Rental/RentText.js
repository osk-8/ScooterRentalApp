import React from "react";

import styles from "./Rental.module.css";

class RentText extends React.Component {
  render() {
    return <h1 className={styles["description-on-top"]}>{this.props.txt}</h1>;
  }
}

export default RentText;
