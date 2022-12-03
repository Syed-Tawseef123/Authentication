//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");
const UserSchema = new mongoose.Schema({
  email : String,
  password : String
});
UserSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const user = mongoose.model("user",UserSchema);
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
  res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
const newUser = new user({
  email : req.body.username,
  password : req.body.password
});
newUser.save(function(err){
  if(err){
    console.log(err);
  }
  else{
    res.render("secrets");
  }
});
});
app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  user.findOne({email : username},function(err,foundUser){
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets")
      }
      else{
        res.send("Password is incorrect");
      }

    }
    else{
      res.send("User not found !!!")
    }
  });
});
app.listen(3000,function(req,res){
  console.log("Server is up on port 3000");
});
