const campground = require("./models/campground");
const seedDb = require("./seeds");

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user")


mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.get("/", function(req,res){
    res.render("landing");
});
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



// var campgrounds = [
//     {name: "zhonghao1", image: "https://www.lokeshdhakar.com/projects/lightbox2/images/image-3.jpg"},
//     {name: "zhonghao2", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"},
//     {name: "zhonghao3", image: "https://www.w3schools.com/w3css/img_lights.jpg"},
// ];



// seedDb();//run function: renew comments

// Index - show all campgrounds
app.get("/campgrounds", function(req, res){
    // res.render("campgrounds", {campgrounds: campgrounds});
    // Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allcampgrounds});
        }  
    });

});
    


// Create - add new campgrounds
app.post("/campgrounds", function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newcampgrounds = {name: name, image: image, description: desc};
    // add to campgrounds Array 
    // campgrounds.push(newcampgrounds)
    // Create a new campground and save to database
    Campground.create(newcampgrounds, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            // redirect to campgrounds page 
            res.redirect("/campgrounds");
        }
    }); 
});

// New - show form to create new campgrounds
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// Show - show info about one campground --这个route必须在上一个route后面，否则：id会覆盖new, 无法打开""/campgrounds/new""
app.get("/campgrounds/:id", function(req, res){
    // Find the campgrounds with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // render show template with that campground 
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
    
});

// ==================
// COMMENTS routes
// ==================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by ID 
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // lookup campground using ID 
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // creat new comment 
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    // connect new comment to campground 
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

// ==================
// Auth routes
// ==================
// 1)show register form
app.get("/register", function(req, res){
    res.render("register");
});
// 2)handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// 1)show login form
app.get("/login", function(req, res){
    res.render("login");
});
// 2)handle lopgin logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    }
    ), function(req, res){
});

// add log out route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(3000, function(){
    console.log("YelpCamp started!");
});