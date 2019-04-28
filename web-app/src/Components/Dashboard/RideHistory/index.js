import React from "react";

import HistoryList from "./HistoryList";
import styles from "./RideHistory.module.css";

class RideHistory extends React.Component {
  render() {
    return (
      <div>
        <h1 className={styles["history-header"]}>Ride history</h1>
        <HistoryList />
      </div>
    );
  }
}

export default RideHistory;
