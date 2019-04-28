import React from "react";
import axios from "axios";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class LocationsMap extends React.Component {
  state = {
    markers: null
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/scootersLocations"
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

  render() {
    const style = {
      width: "100%",
      height: "70%"
    };

    return (
      <Map
        google={this.props.google}
        style={style}
        zoom={13}
        initialCenter={{
          lat: 50.058683,
          lng: 19.944544
        }}
      >
        {this.state.markers}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBaFSTogS0eS_ahQwISoQaD__r2g3KVlFg"
})(LocationsMap);
