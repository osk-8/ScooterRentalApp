import db from '../db';
import Helper from './Helper';
import joi from 'joi';

const Scooter = {
	async startRental(req, res) {
		const schema = {
			scooterId : joi.string().required()			
		}

		const {error} = joi.validate(req.body, schema);
		if(error) {
			console.log("1");
			return res.status(400).send({"message" : error.details[0].message});
		}


		const queryText = `SELECT ride.start_wynajmu_hulajnogi
						  ($1, $2)`;
		const values 	= [req.user.id,
						   req.body.scooterId];

	    try {
	    	const { rows } = await db.query(queryText, values);
		    return res.status(201).send({"message" : "Rental started"});
	    } 
	    catch(error) {
			console.log("3");	    	
	    	console.log(error);
	        return res.status(400).send({"message" : "Cannot rent a scooter"});
	    }
	},

	async endRental(req, res) {
		console.log("end rental");
		const schema = {
			scooterId : joi.string().required(),		
			lat : joi.string().required(),
			lng : joi.string().required()
		}

		const {error} = joi.validate(req.body, schema);
		if(error)
			return res.status(400).send({"message":error.details[0].message});

		const queryText = `SELECT ride.koniec_wynajmu_hulajnogi
						  ($1, $2, $3)`;
		const position = {"lat": req.body.lat, "lng": req.body.lng};
		const values 	= [req.user.id,
						   req.body.scooterId,
						   position];

	    try {
	    	const { rows } = await db.query(queryText, values);
		    return res.status(201).send({"message" : "Rental ended"});
	    } 
	    catch(error) {
	    	console.log(error);
	        return res.status(400).send({"message" : "Cannot finish renting"});
	    }
	},

	async shareLocation(req, res) {
		const queryText = `SELECT * FROM ride.lokalizacje_dostepnych_hulajnog`;

		try {
			const { rows, rowCount } = await db.query(queryText);
			return res.status(200).json({scooters : rows, scootersCount : rowCount });
		}
		catch(error) {
			console.log(error);
			return res.status(400).send(error);
		}
	}	

}

export default Scooter;