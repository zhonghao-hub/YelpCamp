var express = require("express");
var app  = express();
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.get("/", function(req,res){
    res.render("landing");
});

var campgrounds = [
    {name: "zhonghao1", image: "https://www.lokeshdhakar.com/projects/lightbox2/images/image-3.jpg"},
    {name: "zhonghao2", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"},
    {name: "zhonghao3", image: "https://www.w3schools.com/w3css/img_lights.jpg"},
    {name: "zhonghao1", image: "https://www.lokeshdhakar.com/projects/lightbox2/images/image-3.jpg"},
    {name: "zhonghao2", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png"},
    {name: "zhonghao3", image: "https://www.w3schools.com/w3css/img_lights.jpg"}
];

app.get("/campgrounds", function(req,res){
    res.render("campgrounds", {campgrounds: campgrounds});
});



app.post("/campgrounds", function(req, res){
    // get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newcampgrounds = {name: name, image: image};
    // add to campgrounds Array 
    campgrounds.push(newcampgrounds)
    // redirect to campgrounds page 
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("YelpCamp started!");
});