var express = require("express");
var router = express.Router({mergeParams: true}),
    passport = require("passport"),
    User = require("../models/user");
router.get("/", function(req,res){
    res.render("landing");
});


// ==================
// Auth routes
// ==================
// 1)show register form
router.get("/register", function(req, res){
    res.render("register");
});
// 2)handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            console.log("This is a error!!!!");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// 1)show login form
router.get("/login", function(req, res){
    res.render("login");
});
// 2)handle lopgin logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    }
    ), function(req, res){
});

// add log out route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;