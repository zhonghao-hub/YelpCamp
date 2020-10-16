var Campground = require("../models/campground");
var Comment = require("../models/comment");
// all the middleware goes here 
var middlewareObj = {};

// Authorization: check if is logged in: Yes: if the current user is the same as the user post the post, No: redirect("back")
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                // does user own the campground
                // foundcampground.author.id: Object
                // req.user._id: string (logged in user's id)
                if(foundCampground.author.id.equals(req.user._id)){
                    next();//do the work in {}, where call this funcion
                }
                else{
                    res.redirect("back");
                }
                
            }
        });
    }
    else{
        res.redirect("back");//redirect back to the previous page
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                // does user own the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();//do the work in {}, where call this funcion
                }
                else{
                    res.redirect("back");
                }
                
            }
        });
    }
    else{
        res.redirect("back");//redirect back to the previous page
    }
};

// Authentication: check if is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = middlewareObj;