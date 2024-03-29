const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

const List = require("../models/List.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { email, passwordHash } = req.body;

  if (!email) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your email address.",
    });
  }

  // Check password safety
  
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(passwordHash)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }


  // Search the database for a user with the email submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message email is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already exists." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(passwordHash, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        
        //create sample list for user upon registration
        const lists = [
          {
              name: "My Favorites",
              description: "My favorite Products.",
              user: user._id
          }, 
          {
              name: "Clothes",
              description: "List of clothes on my shopping list.",
              user: user._id
          },
          {
              name: "Accessories",
              description: "Accessories I would like to buy.",
              user: user._id
          },
          {
              name: "Home",
              description: "Things I need for my home.",
              user: user._id
          }, 
          {
              name: "Christmas Presents",
              description: "Presents for my loved ones.",
              user: user._id
          }
      ];

      return List.create(lists)
       
      })
      .then(() => res.redirect("/products"))
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "An account for this email already exists.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, passwordHash } = req.body;

  if (!email) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your email.",
    });
  }

  if (passwordHash.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(passwordHash, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        return res.redirect("/products");
      });
    })

    .catch((err) => {
      next(err);
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

module.exports = router;
