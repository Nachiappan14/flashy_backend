const mongoose=require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const flog = require("../utils/log");
const config = require("../config.js")

const User = require("../models/users");

var jwtSecret=config.jwtSecret;

module.exports.addUser = async function (req, res) {
	flog("");
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array() });
	}

	const { name, password } = req.body;

	try{
		let user = await User.findOne({name});
		
		if(user) {
			return res.status(400).json({ errors: [{msg: "User already exists"}] });
		}
		user = new User({
			name,
			password,
		});

		const salt = await bcrypt.genSalt(10);
		
		user.password = await bcrypt.hash(password,salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret,{expiresIn: 360000}, (err, token)=>{
			if(err) throw err;
			res.json({token});
		});
	} catch (err){
		console.error(err.message);
		return res.status(500).send("Internal Server Error");
	}
}



module.exports.loginUser = async function (req,res) {
	const errors = validationResult(req);

	if(!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, password } = req.body;

	try {
		let user = await User.findOne({ name });

		if(!user){
			return res.status(400).json({
				errors: [{msg: "Invaild Credentials"}]
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if(!isMatch){
			return res
				.status(400)
				.json({
					errors: [{msg:"Invaild Credentials"}]
				});
		}


		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: "5 days"},(err, token)=>{
			if(err) throw err;
			res.json({token});
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Internal Server Error");
	}
}


module.exports.getUser = async function (req,res) {
	// const {user} = req; 
	try{
		const user = await User.findById(req.user.id);
		if(user){
			return res.json(user.select("-password"));
		}
		else{
			return res.status(400).json({errors:[{msg:"Invalid Creds"}]});
		}
	} catch (err) {
		console.error(err.message);
		return res.status(500).send("Internal Server Error");
	}
}
