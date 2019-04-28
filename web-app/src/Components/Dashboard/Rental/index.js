import React from "react";
import axios from "axios";
import StartRentPanel from "./StartRentPanel";
import EndRentPanel from "./EndRentPanel";

class Rental extends React.Component {
  state = {
    isRented: null,
    scooterId: null
  };

  componentDidMount() {
    axios({
      method: "get",
      url: "http://pascal.fis.agh.edu.pl:1777/userRentalStatus",
      headers: {
        "x-access-token": localStorage.getItem("userToken")
      }
    }).then(response => {
      if (response.data.isRented === "true") {
        this.setState({
          isRented: true,
          scooterId: response.data.scooterId
        });
      } else {
        this.setState({
          isRented: false
        });
      }
    });
  }

  startRental = scooterId => {
    this.setState({ isRented: true, scooterId: scooterId });
  };

  endRental = () => {
    this.setState({ isRented: false, scooterId: null });
  };

  render() {
    return (
      <div>
        {this.state.isRented ? (
          <div>
            <EndRentPanel
              endRental={this.endRental}
              scooterId={this.state.scooterId}
            />
          </div>
        ) : (
          <StartRentPanel startRental={this.startRental} />
        )}
      </div>
    );
  }
}

export default Rental;
