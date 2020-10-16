var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.get("/", function(req,res){
    res.render("landing");
});

// Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);//generate campgrounds collections 

// Campground.create({
//     name: "zhonghao3", 
//     image: "https://www.w3schools.com/w3css/img_lights.jpg",
//     description: "This is a huge grantie hill, no bathroom, no water, beautiful grantie!"

// }, function(err, campground){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("Newly Created Campground: ");
//         console.log(campground);
//     }
// });


// var campgrounds = [
//     {name: "zhonghao1", image: "https://www.lokeshdhakar.com/projects/lightbox2/images/image-3.jpg"},
//     {name: "zhonghao2", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"},
//     {name: "zhonghao3", image: "https://www.w3schools.com/w3css/img_lights.jpg"},
// ];


// Index - show all campgrounds
app.get("/campgrounds", function(req, res){
    // res.render("campgrounds", {campgrounds: campgrounds});
    // Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {campgrounds: allcampgrounds});
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
    res.render("new");
});

// Show - show info about one campground --这个route必须在上一个route后面，否则：id会覆盖new, 无法打开""/campgrounds/new""
app.get("/campgrounds/:id", function(req, res){
    // Find the campgrounds with provided id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            // render show template with that campground 
            res.render("show", {campground: foundCampground});
        }
    });
    
    
});

app.listen(3000, function(){
    console.log("YelpCamp started!");
});