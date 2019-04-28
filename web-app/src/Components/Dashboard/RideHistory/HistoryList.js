import React from "react";
import axios from "axios";
import { openDb } from "idb";

import styles from "./RideHistory.module.css";

const dbPromise = openDb("ride-store", 1, upgradeDB => {
  upgradeDB.createObjectStore("rides");
});

const idbRides = {
  async getAllRides(key) {
    const db = await dbPromise;
    return db
      .transaction("rides")
      .objectStore("rides")
      .getAll();
  },
  async clear() {
    const db = await dbPromise;
    const tx = db.transaction("rides", "readwrite");
    tx.objectStore("rides").clear();
    return tx.complete;
  },
  async setRide(key, val) {
    const db = await dbPromise;
    const tx = db.transaction("rides", "readwrite");
    tx.objectStore("rides").put(val, key);
    return tx.complete;
  }
};

class HistoryList extends React.Component {
  state = {
    rides: null
  };
  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/getRideHistory",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(async response => {
        if (response.data) {
	  await idbRides.clear();
          response.data.rides.map(async data => {
            await idbRides.setRide(data.id_przejazdu, data);
          });
          console.log("Local database has been updated");

          const history = await idbRides.getAllRides();

          this.setState({
            rides: history.map(history => {
              return (
                <li
                  key={history.id_przejazdu}
                  className={styles["history-list-item"]}
                >
                  <p className={styles["history-list-item-data"]}>
                    {this.formatDate(history.data_poczatku_wynajmu)}
                  </p>
                  <p className={styles["history-list-item-cost"]}>
                    cost: {history.koszt}
                  </p>
                </li>
              );
            })
          });
        }
      })
      .catch(async error => {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }

        const history = await idbRides.getAllRides();

        this.setState({
          rides: history.map(history => {
            return (
              <li
                key={history.id_przejazdu}
                className={styles["history-list-item"]}
              >
                <p className={styles["history-list-item-data"]}>
                  {this.formatDate(history.data_poczatku_wynajmu)}
                </p>
                <p className={styles["history-list-item-cost"]}>
                  cost: {history.koszt}
                </p>
              </li>
            );
          })
        });
      });
  }

  formatDate = timestamp => {
    timestamp = new Date(timestamp);
    return timestamp.toLocaleString();
  };

  render() {
    return <ul className={styles["history-list"]}>{this.state.rides}</ul>;
  }
}

export default HistoryList;
