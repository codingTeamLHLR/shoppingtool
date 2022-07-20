const router = require("express").Router();
const mongoose = require("mongoose");

const List = require("../models/List.model");
const Product = require("../models/Product.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");


router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("lists/list-create");
})


router.post("/create", isLoggedIn, (req, res, next) => {
    const listDetails = {
        name: req.body.name,
        description: req.body.description,
        user: req.session.user._id
      };

    List.create(listDetails)
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})



// router.get("/:listId", (req, res, next) => {

//     const { listId } = req.params;

//     Product.find({list: {_id: listId} } )
//     .then(products => {
//          res.render("products/products-list", {products})
//      })
//     .catch(error => {
//          console.log("Error while trying to reach DB", error);
//      })

// })

module.exports = router;
