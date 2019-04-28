import React from "react";
import Navbar from "../Navbar/UnloggedNav";
import LocationsMap from "./LocationsMap";
import styles from "./Home.module.css";
import image1 from "../../data/homePage1.jpeg";
import image2 from "../../data/homePage2.jpg";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <img src={image1} className={styles["home-image"]} alt="Title" />
        <h1 className={styles["home-image-header"]}>
          Electric scooters for Everyone
        </h1>
        <h3 className={styles["home-image-text"]}>
          the urban future of mobility.
        </h3>

        <h1 className={styles["home-locations-header"]}>
          Current scooters locations in Cracow
        </h1>
        <p className={styles["home-article-text"]}>
          Put away the vehicles. <br />
          Choose scooters and help the city catch its breath. Get the app and
          ride.
        </p>
        <div className={styles["home-locations-map"]}>
          <LocationsMap />
        </div>
        <footer className={styles["home-footer"]}>
          <p className={styles["home-footer-text"]}>
            Oskar Szewczyk 2019.
            <br />
            AGH University of Science and Technology
            <br />
            All rights reserved.
          </p>
          <img
            src={image2}
            className={styles["home-footer-image"]}
            alt="Scooter"
          />
          <p className={styles["home-footer-description"]}>
            Take a <b>RIDE.</b>
          </p>
        </footer>
      </div>
    );
  }
}

export default Home;
