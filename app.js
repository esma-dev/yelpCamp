const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  methodOverride = require("method-override"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  seedDB = require("./seeds"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  User = require("./models/user");

//requiring all of our routes
const commentRoutes = require("./routes/comments.js"),
	  campgroundRoutes = require("./routes/campgrounds.js"),
	  indexRoutes = require("./routes/index.js");

// seedDB(); //seeding the database with new campgrounds
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public")); //serving the public directory to our Express app
app.use(methodOverride("_method"));

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Yelp camp secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currUser = req.user;
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// =============================================================================================
// COMMENTS ROUTES
// =============================================================================================



// =============================================================================================
// AUTH ROUTES
// =============================================================================================




app.listen(3000, () => {
	console.log('Yelp Camp Server is live!');
});



