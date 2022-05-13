const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { check } = require("express-validator");
const {
	addUser,
	getUser,
	loginUser,
	modifyUser,
	sendRequest,
	updateRequest,
} = require("../controllers/users.js");


// Register User
router.post(
	"/register",
	[
		check("name", "Name is Required").not().isEmpty(),
		check(
			"password",
			"Please Enter Password With 6 Or More Characters"
		).isLength({ min: 6 }),
	],
	addUser
);

// Get User
router.get("/auth", auth, getUser);

// Authenticate the user
router.post(
	"/auth",
	[
		check("name", "Name is Required").not().isEmpty(),
		check("password", "Password is Required").exists(),
	],
	loginUser
);

//Modify user details
router.post(
	"/modify",
	[
		check(
			"password",
			"Please Enter Password With 6 Or More Characters"
		).isLength({ min: 6 }),
		auth
	],
	modifyUser
)

//Send Friend Request
router.post("/sendRequest", auth, sendRequest)

//Update Friend Request
router.post("/updateRequest", auth, updateRequest);

module.exports = router;
