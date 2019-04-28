import React from "react";
import { Route } from "react-router-dom";

import LinkButton from "./LinkButton";
import LoggedNav from "../Navbar/LoggedNav";
import Rental from "./Rental/";
import Wallet from "./Wallet/";
import RideHistory from "./RideHistory/";
import Edit from "./Edit/";
import styles from "./Dashboard.module.css";

class Dashboard extends React.Component {
  render() {
    return (
      <React.Fragment>
        <LoggedNav />
        <div className={styles["dashboard"]}>
          <div className={styles["dashboard-sidebar"]}>
            <ul>
              <li className={styles["dashboard-sidebar-buttons"]}>
                <LinkButton path="/dashboard/rental" text="Rent scooter" />
              </li>
              <li className={styles["dashboard-sidebar-buttons"]}>
                <LinkButton path="/dashboard/wallet" text="Wallet" />
              </li>
              <li className={styles["dashboard-sidebar-buttons"]}>
                <LinkButton path="/dashboard/history" text="Ride History" />
              </li>
              <li className={styles["dashboard-sidebar-buttons"]}>
                <LinkButton path="/dashboard/edit" text="Edit Profile" />
              </li>
            </ul>
          </div>

          <div className={styles["dashboard-content"]}>
            <Route path="/dashboard/rental" component={Rental} />
            <Route path="/dashboard/wallet" component={Wallet} />
            <Route path="/dashboard/history" component={RideHistory} />
            <Route path="/dashboard/edit" component={Edit} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
