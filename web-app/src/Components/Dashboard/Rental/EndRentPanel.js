import React from "react";
import ScootersMapEnd from "./EndRentMap";
import RentText from "./RentText";

class EndRentPanel extends React.Component {
  state = {
    position: null
  };

  setPosition = (lat, lng) => {
    this.setState({
      position: { lat, lng }
    });
  };

  render() {
    return (
      <React.Fragment>
        <RentText txt="To finish rental choose your position on map" />
        <ScootersMapEnd
          setPosition={this.setPosition}
          scooterId={this.props.scooterId}
          position={this.state.position}
          endRental={this.props.endRental}
        />
      </React.Fragment>
    );
  }
}

export default EndRentPanel;
