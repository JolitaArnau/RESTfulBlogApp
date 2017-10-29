var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mehtodOverride  = require("method-override"),
    mongoose        = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(mehtodOverride("_method"));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    crated: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function (req, res) {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("ERROR" + err);
        }
        else {
            res.render("index", {blogs: blogs});
        }
    });
});
// NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function (req, res) {
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
   Blog.findById(req.params.id, function (err, foundBlogPost) {
       if (err) {
           res.redirect("/blogs");
       }
       else {
           res.render("show", {blog: foundBlogPost});
       }

   });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function (req,res) {
    Blog.findById(req.params.id, function (err, foundBlogPost) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.render("edit", {blog: foundBlogPost});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlogPost) {
        if (err) {
            res.redirect("/blogs");
        }
        else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.listen(3000, function () {
    console.log('Up and running!')
});