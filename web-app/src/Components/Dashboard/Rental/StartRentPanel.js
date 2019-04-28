import React from "react";
import ScootersMap from "./StartRentMap";
import RentText from "./RentText";

class StartRentPanel extends React.Component {
  render() {
    return (
      <React.Fragment>
        <RentText txt="Click on marker to rent a scooter" />
        <ScootersMap startRental={this.props.startRental} />
      </React.Fragment>
    );
  }
}

export default StartRentPanel;
