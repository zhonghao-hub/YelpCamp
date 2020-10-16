var express = require("express");
const campground = require("../models/campground");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

// Index - show all campgrounds
router.get("/", function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampgrounds = {name: name, image: image, description: desc, author:author};
    
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show - show info about one campground --这个route必须在上一个route后面，否则：id会覆盖new, 无法打开""/campgrounds/new""
router.get("/:id", function(req, res){
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


// Edit Campgrounds route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });

});

// Update Campgrounds route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the corrrect campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedcampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect somewhere
});

// Destory campground route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;