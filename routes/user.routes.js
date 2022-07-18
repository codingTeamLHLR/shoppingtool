const router = require("express").Router();
const mongoose = require("mongoose");

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");



router.get("/", isLoggedIn, (req, res, next) => {

 User.findById(req.session.user._id)
     .then(user => {
        const today = new Date();
        const hours = today.getHours();
        let time;
        
        if(hours < 12){
            time = "Morning"
        } else if (hours < 18) {
            time = "Afternoon"
        } else {
            time = "Evening"
        }
        res.render("user/user-home", {user: user, time: time})
     })
     .catch(error => {
         console.log("Error while trying to reach DB", error);
     })
 
 })

 module.exports = router;
