import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

import EndRentButton from "./EndRentButton";
import InfoWindowEx from "./InfoWindowEx";
import styles from "./Rental.module.css";

class ScootersMapEnd extends React.Component {
  state = {
    marker: {
      position: null,
      visible: false
    }
  };

  handleClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    this.setState({
      marker: { position: { lat, lng }, visible: true }
    });
    return this.props.setPosition(lat, lng);
  };

  render() {
    const style = {
      width: "100%",
      height: "100%"
    };

    return (
      <Map
        google={this.props.google}
        style={style}
        className={styles["rental-map"]}
        zoom={13}
        initialCenter={{
          lat: 50.058683,
          lng: 19.944544
        }}
        onClick={this.handleClick}
      >
        <Marker position={this.state.marker.position} visible={false} />

        <InfoWindowEx
          position={this.state.marker.position}
          visible={this.state.marker.visible}
        >
          <EndRentButton
            scooterId={this.props.scooterId}
            position={this.state.marker.position}
            endRental={this.props.endRental}
          />
        </InfoWindowEx>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBaFSTogS0eS_ahQwISoQaD__r2g3KVlFg"
})(ScootersMapEnd);
