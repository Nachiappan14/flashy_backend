const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const flog = require("../utils/log");
const config = require("../config.js")

const User = require("../models/users");
const { db } = require('../models/users');

var jwtSecret = config.jwtSecret;

module.exports.addUser = async function (req, res) {

	// logging the required informaton
	var id = null;
	if (req.user != undefined) id = req.user.id;
	var logText = req.method + " " + req.originalUrl + " " + id + " ";

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		flog(logText + "400");
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, password } = req.body;

	try {
		let user = await User.findOne({ name });

		if (user) {
			flog(logText + "400");
			return res.status(400).json({ errors: [{ msg: "User already exists" }] });
		}
		user = new User({
			name,
			password,
		});

		const salt = await bcrypt.genSalt(10);

		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
			if (err) throw err;
			flog(logText + "200");
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		flog(logText + "500");
		return res.status(500).send("Internal Server Error");
	}
}


module.exports.loginUser = async function (req, res) {
	// logging the required informaton
	let id = null;
	if (req.user != undefined) id = req.user.id;
	let logText = req.method + " " + req.originalUrl + " " + id + " ";

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		flog(logText + "400");
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, password } = req.body;

	try {
		let user = await User.findOne({ name });

		if (!user) {
			flog(logText + "400");
			return res.status(400).json({
				errors: [{ msg: "Invaild Credentials" }]
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			flog(logText + "400");
			return res
				.status(400)
				.json({
					errors: [{ msg: "Invaild Credentials" }]
				});
		}


		const payload = {
			user: {
				id: user.id,
			},
		};

		jwt.sign(payload, jwtSecret, { expiresIn: "5 days" }, (err, token) => {
			if (err) throw err;
			flog(logText + "200");
			res.json({ token });
		});
	} catch (err) {
		console.error(err.message);
		flog(logText + "500");
		return res.status(500).send("Internal Server Error");
	}
}


module.exports.getUser = async function (req, res) {
	// logging the required info
	var id = null;
	if (req.user != undefined) id = req.user.id;
	var logText = req.method + " " + req.originalUrl + " " + id + " ";

	try {
		const user = await User.findById(req.user.id).select("-password");
		if (user) {
			flog(logText + "200");
			return res.json(user);
		}
		else {
			flog(logText + "400");
			return res.status(400).json({ errors: [{ msg: "Invalid Creds" }] });
		}
	} catch (err) {
		console.error(err.message);
		flog(logText + "500");
		return res.status(500).send("Internal Server Error");
	}
}


module.exports.modifyUser = async function (req, res) {
	// logging the required info
	var id = null;
	if (req.user != undefined) id = req.user.id;
	var logText = req.method + " " + req.originalUrl + " " + id + " ";


	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		flog(logText + "400");
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, password } = req.body;

	try {
		let user = await User.findById(id);

		if (!user) {
			flog(logText + "400");
			return res.status(400).json({ errors: [{ msg: "UserId not present" }] });
		}

		var payload = {};

		if (name) {
			const records = await User.findOne({ "name": name });
			if (records) {
				if (records._id != id) {
					flog(logText + "400");
					return res.status(400).json({ errors: [{ msg: "UserName already present" }] });
				}
			} 
				payload.name = name;
		}

		const salt = await bcrypt.genSalt(10);

		payload.password = await bcrypt.hash(password, salt);

		var updateLog = await User.updateOne({ _id: id }, payload);
		
		if (updateLog.modifiedCount < 1) {
			flog(logText + "400");
			return res.status(400).json({ errors: [{ msg: "failed to update" }] });
		} else 
		{
			const user = await User.findById(id);

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
				if (err) throw err;
				flog(logText + "200");
				res.json({ msg: "Update Successful" });
			});
		}
	} catch (err) {
		console.error("Error",err.message);
		flog(logText + "500");
		return res.status(500).send("Internal Server Error");
	}
}