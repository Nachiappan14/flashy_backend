const jwt = require("jsonwebtoken");
// const config = require("../config.js");
const flog = require("../utils/log");

var jwtSecret = process.env.JWT_SECRET || "secret";

module.exports = function (req, res, next) {
	// Logging
	var id = null;
	if (req.user != undefined) id = req.user.id;
	var logText = req.method + " " + req.originalUrl + " " + id + " ";

	//Get token from header
	const token = req.header("x-auth-token");


	//Check if there is no token in the header
	if (!token) {
		flog(logText+"401");
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	
	//Verify token
	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded.user;
		next();
	} catch (err) {
		flog(logText+"401");
		res.status(401).json({ msg: "Token is not valid" });
	}
};
