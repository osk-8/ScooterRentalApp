import db from '../db';
import Helper from './Helper';
import joi from 'joi';

const User = {

	async registerUser(req, res) {
		const schema = {
			name    : joi.string().max(20).required(),
			surname : joi.string().max(30).required(),
			email   : joi.string().email({minDomainAtoms: 2}).required(),
			password: joi.string().min(7).required()
		};

		const {error} = joi.validate(req.body, schema);
		if(error)
			return res.status(400).send({"message":error.details[0].message});

	    const hashPassword = Helper.hashPassword(req.body.password);
		const queryText    = `INSERT INTO
	      				   	  ride.uzytkownicy(imie, nazwisko, adres_email, haslo)
	      				      VALUES($1, $2, $3, $4)
	      				      returning *`;
	    const values       = [req.body.name,
	      				      req.body.surname,
	      				      req.body.email,
	      				      hashPassword];

	    try {
	    	const { rows } = await db.query(queryText, values);

		    const token = Helper.generateToken(rows[0].id_uzytkownika);
		    return res.status(201).send({ token });
	    } 
	    catch(error) {
	    	console.log(error);
	        return res.status(400).send({ 'message': 'Incorrect email adres' });
	    }
  },

  	async login(req, res) {
  		const schema = {
			email   : joi.string().email({minDomainAtoms: 2}).required(),
			password: joi.string().min(7).required()
  		}
	
		const {error} = joi.validate(req.body, schema);
		if(error)
			return res.status(400).send({"message":error.details[0].message});

	    try {
		    const { rows } = await db.query('SELECT * FROM ride.uzytkownicy WHERE adres_email = $1', [req.body.email]);

		    if (!rows[0]) 
		    	return res.status(400).send({'message': 'Incorrect data'});	      
		    if(!Helper.comparePassword(rows[0].haslo, req.body.password))
		        return res.status(400).send({ 'message': 'Incorrect data' });

		    const token = Helper.generateToken(rows[0].id_uzytkownika);
		    return res.status(200).send({ token });
	    } 
	    catch(error) {
	    	console.log(error);
	    	return res.status(400).send(error);
	    }
	},

	async updateUser(req, res) {
		const schema = {
			name    : joi.string().max(20).required(),
			surname : joi.string().max(30).required(),
			email   : joi.string().email({minDomainAtoms: 2}).required(),
			password: joi.string().min(7).required()
		};

		const {error} = joi.validate(req.body, schema);
		if(error)
			return res.status(400).send({"message":error.details[0].message});

	    const hashPassword = Helper.hashPassword(req.body.password);
		const queryText    = `UPDATE ride.uzytkownicy
	      				   	  SET (imie, nazwisko, adres_email, haslo) = ($1, $2, $3, $4)
	      				      WHERE	id_uzytkownika = $5`;
	    const values       = [req.body.name,
	      				      req.body.surname,
	      				      req.body.email,
	      				      hashPassword,
	      				      req.user.id];

	    try {
	    	const { rows } = await db.query(queryText, values);

		    return res.status(200).send({"message" : "User profile has been edited"});
	    } 
	    catch(error) {
	    	console.log(error);
	        return res.status(400).send({ "message": "Incorrect data" });
	    }
  },

 	async getUserData(req, res) {
  		const queryText = `SELECT imie, nazwisko, adres_email 
  						   FROM ride.uzytkownicy
  						   WHERE id_uzytkownika = $1`;
  		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			if(rows[0])
  				return res.status(200).json({data: rows[0]});
  			else
  			return res.status(400).send({ 'message': 'Cannot get user data' });
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot get user data' });
  		}
  },


	async getRideHistory(req, res) {
		const queryText = `SELECT id_przejazdu, data_poczatku_wynajmu, czas_wypozyczenia, koszt 
						   FROM ride.przejazdy
						   WHERE id_uzytkownika = $1`;

		try {
			const { rows, rowCount } = await db.query(queryText, [req.user.id]);
			return res.status(200).json({rides : rows, ridesCount : rowCount });
		}
		catch(error) {
			console.log(error);
			return res.status(400).send(error);
		}
	},

	async isRenting(req, res) {
		const queryText = `SELECT id_przejazdu, id_hulajnogi
  						   FROM ride.przejazdy
  						   WHERE id_uzytkownika = $1 AND czas_wypozyczenia IS NULL`;
  		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			if(rows[0])
  				return res.status(200).json({'isRented': 'true', 'scooterId' : rows[0].id_hulajnogi});
  			else
  				return res.status(200).send({ 'isRented': 'false' });
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot get informations about scooter' });
  		}
	},

	async deleteUser(req, res) {
  		const queryText = `DELETE FROM ride.uzytkownicy 
  						   WHERE id_uzytkownika = $1`;
  		try {
  			const {rows} = await db.query(queryText, [req.user.id]);

  			return res.status(200).send({"message" : "User profile has been deleted"});
  		}
  		catch(error) {
  			console.log(error);
  			return res.status(400).send({ 'message': 'Cannot delete user profile' });
  		}
  }
}

export default User;
