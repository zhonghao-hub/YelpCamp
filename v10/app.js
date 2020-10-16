const campground = require("./models/campground");
const seedDb = require("./seeds");

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),

    User = require("./models/user")

// requiring routes I
var indexRoute = require("./routes/index");
var commentRoute = require("./routes/comments");
var campgroundRoute = require("./routes/campgrounds");


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// Passport Configuration
app.use(require("express-session")({
    secret:"Say anything you want",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// requiring routes II
app.use("/", indexRoute);
app.use("/campgrounds/:id/comments", commentRoute);
app.use("/campgrounds", campgroundRoute);



// var campgrounds = [
//     {name: "zhonghao1", image: "https://www.lokeshdhakar.com/projects/lightbox2/images/image-3.jpg"},
//     {name: "zhonghao2", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"},
//     {name: "zhonghao3", image: "https://www.w3schools.com/w3css/img_lights.jpg"},
// ];



// seedDb();//run function: renew comments



app.listen(3000, function(){
    console.log("YelpCamp started!");
});