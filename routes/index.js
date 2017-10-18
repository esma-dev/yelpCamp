const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

const isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	} else {
		res.render("login");
	}
};

//ROOT ROUTE
router.get('/', (req, res, next) => {
	res.render('landing');
});

//SIGN UP FORM- show register form
router.get("/register", (req, res, next) => {
	res.render("register");	
});

//SIGN UP - handling sign up logic
router.post("/register", (req, res, next) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		}); 
	});
});


//LOGIN FORM - show login form
router.get("/login", (req, res, next) => {
	res.render("login");
});

//LOGIN - handling log in logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
	}),(req, res, next) => {
});

//LOG OUT
router.get("/logout", (req, res, next) => {
	req.logout();
	res.redirect("/campgrounds");
});

module.exports = router;