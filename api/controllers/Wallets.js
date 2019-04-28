import db from '../db';
import Helper from './Helper';
import joi from 'joi';

const Wallet = {
	async isCardAdded(req, res) {
		const queryText = `SELECT nr_karty_kredytowej 
  						   FROM ride.portfele
  						   WHERE id_uzytkownika = $1`;
  		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			if(rows[0].nr_karty_kredytowej)
  				return res.status(200).json({'isCardAdded': 'true'});
  			else
  			return res.status(200).send({ 'isCardAdded': 'false' });
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot get credit card status' });
  		}
	},

	async addCreditCard(req, res) {
		const schema = {
			creditCardNumber: joi.string().creditCard().required(),
			expirationDate  : joi.date().min('now').required(),    
			cscNumber       : joi.string().length(3).required()
		};

		const {error} = joi.validate(req.body, schema);
		if(error) {
			console.log(error);
			return res.status(400).send({"message":error.details[0].message});
		}

		const queryText = `SELECT ride.dodaj_karte_kredytowa
						  ($1, $2, $3, $4)`;
	    const values    = [req.user.id,
	      				   req.body.creditCardNumber,
	      				   req.body.expirationDate,		
	      				   req.body.cscNumber];
	    try {
	    	const { rows } = await db.query(queryText, values);
		    return res.status(201).send({"message" : "Credit card has been added"});
	    } 
	    catch(error) {
	    	console.log(error);
	        return res.status(400).send({"message" : "Cannot add credit card"});
	    }
	},

	async getWalletBalance(req, res) {
		const queryText = `SELECT saldo 
  						   FROM ride.portfele
  						   WHERE id_uzytkownika = $1`;
  		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			const balance = rows[0].saldo;

 			return res.status(200).json({balance});
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot get wallet balance' });
  		}	
	},

	async transferMoneyToAccount(req, res) {
		const schema = {
			amount : joi.string().required()
		}

		const {error} = joi.validate(req.body, schema);
		if(error)
			return res.status(400).send({"message":error.details[0].message});

		const queryText = `SELECT ride.doladowanie_salda
						  ($1, $2)`;
		const values 	= [req.user.id,
						   req.body.amount];

	    try {
	    	const { rows } = await db.query(queryText, values);
		    return res.status(201).send({"message" : "Successful transaction"});
	    } 
	    catch(error) {
	    	console.log(error);
	        return res.status(400).send({"message" : "Transaction failed"});
	    }
	},

	async removeCreditCard(req, res) {
  			const queryText = `SELECT ride.usun_karte_kredytowa_uzytkownika($1)`;				

   		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			return res.status(200).send({"message" : "Credit card has been removed"});
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot delete credit card' });
  		}
	}



}

export default Wallet;
