import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import axios from "axios";

import InfoWindowEx from "./InfoWindowEx";
import styles from "./Rental.module.css";

class ScootersMap extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    markers: null
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/scootersLocations",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(response => {
        if (response.data) {
          this.setState({
            markers: response.data.scooters.map(data => {
              return (
                <Marker
                  key={data.numer}
                  name={data.numer}
                  position={{
                    lat: data.polozenie.lat,
                    lng: data.polozenie.lng
                  }}
                  onClick={this.onMarkerClick}
                />
              );
            })
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

  handleSubmit = event => {
    event.preventDefault();

    axios({
      method: "post",
      url: "http://pascal.fis.agh.edu.pl:1777/startRental",
      data: {
        scooterId: this.state.selectedPlace.name
      },
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    })
      .then(response => {
        return this.props.startRental(this.state.selectedPlace.name);
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
  };

  onMarkerClick = (props, marker, event) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClicked = (t, map, coord) => {
    if (this.setState.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    const style = {
      width: "100%",
      height: "100%"
    };

    return (
      <div className={styles["rental-map"]}>
        <Map
          google={this.props.google}
          style={style}
          zoom={13}
          initialCenter={{
            lat: 50.058683,
            lng: 19.944544
          }}
          onClick={this.onMapClicked}
        >
          {this.state.markers}
          <InfoWindowEx
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <React.Fragment>
              <button
                type="button"
                className={styles["rent-button"]}
                onClick={this.handleSubmit}
              >
                click to rent
              </button>
            </React.Fragment>
          </InfoWindowEx>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBaFSTogS0eS_ahQwISoQaD__r2g3KVlFg"
})(ScootersMap);
