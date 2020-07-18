//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const atlasPass = process.env.ATLAS_PASS;

// default text samples
const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
//

// initialize modules
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//

// connect to Mongo DB
mongoose.connect("mongodb+srv://admin-jan:" + atlasPass + "@cluster0.njvgj.mongodb.net/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//

// create DB schema (blogSchema)
const blogSchema = {
  title: String,
  content: String
};
//

// create blogSchema model (BlogPost)
const BlogPost = mongoose.model("BlogPost", blogSchema);
//


// HOME route
app.get("/", (req, res) => {
  BlogPost.find({}, function(err, foundPosts) {
      res.render("home", {
        homeCont: homeStartingContent,
        allPosts: foundPosts
      });
  });
});
//

// ABOUT  GET route
app.get("/about", (req, res) => {
  res.render("about", {
    about: aboutContent
  });
});
//

// CONTACT GET route
app.get("/contact", (req, res) => {
  res.render("contact", {
    contact: contactContent
  });
});
//

// COMPOSE GET route
app.get("/compose", (req, res) => {
  res.render("compose");
});
//

// COMPOSE POST route
app.post("/compose", (req, res) => {
  const newPost = new BlogPost({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  newPost.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

// POSTS GET route
app.get("/posts/:random", (req, res) => {
  const postId = req.params.random;
  BlogPost.findOne({
    _id: postId
  }, function(err, foundPost) {
    if (!err) {
      if (foundPost) {
        res.render("post", {
          singlePost: foundPost
        });
      } else {
        res.redirect("/");
      }
    }
  });
});
//



let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
