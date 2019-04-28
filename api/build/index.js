import express from "express";
import dotenv from "dotenv";
import "babel-polyfill";
import cors from "cors";

import Auth from "./middleware/Auth";
import User from "./controllers/Users";
import Wallet from "./controllers/Wallets";
import Scooter from "./controllers/Scooters";

const app = express();
app.use(cors());

dotenv.config();
app.use(express.json());
app.set('port', process.env.PORT || 5000);
app.set('host', process.env.HOST || 'localhost');

//User
app.post("/registerUser", User.registerUser);
app.post("/login", User.login);
app.get("/getUserData", Auth.verifyToken, User.getUserData);
app.put("/updateUser", Auth.verifyToken, User.updateUser);
app.get("/getRideHistory", Auth.verifyToken, User.getRideHistory);
app.get("/userRentalStatus", Auth.verifyToken, User.isRenting);
app.delete("/deleteUser", Auth.verifyToken, User.deleteUser);

//Wallet
app.get("/checkCard", Auth.verifyToken, Wallet.isCardAdded);
app.get("/getBalance", Auth.verifyToken, Wallet.getWalletBalance);
app.post("/addCreditCard", Auth.verifyToken, Wallet.addCreditCard);
app.post("/prePaid", Auth.verifyToken, Wallet.transferMoneyToAccount);
app.delete("/removeCreditCard", Auth.verifyToken, Wallet.removeCreditCard);

//Scooters
app.post("/startRental", Auth.verifyToken, Scooter.startRental);
app.post("/endRental", Auth.verifyToken, Scooter.endRental);
app.get("/scootersLocations", Scooter.shareLocation);

app.listen(app.get('port'), () => {
  console.log(`Started on port ${app.get('port')}...`);
});