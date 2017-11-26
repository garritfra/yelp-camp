var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*Campground.create(
{
    name: "Hillerse Oker", 
    image: "https://media-cdn.tripadvisor.com/media/photo-s/06/40/73/68/conesus-lake-campgrounds.jpg",
    description: "The Oker is awesome!"     
}
, function(err, campground){
            if(err){
                console.log(err);
            } else {
                console.log("New Campground:");
                console.log(campground);
            }
        });*/

app.get("/", function(req, res){
   res.render("landing");
});


//INDEX
app.get("/campgrounds", function(req, res){
    
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Error");
            console.log(err);
        } else {
            res.render("index", {campgrounds:campgrounds});
        }
    })
    
    //res.render("campgrounds", {campgrounds:campgrounds}); 
});


//CREATE - create DB entry
app.post("/campgrounds", function(req, res) {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc};
    
    Campground.create(newCampground, function(err, newlyCreaded) {
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");            
        }
    });
});


//NEW - show form
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server running");
});