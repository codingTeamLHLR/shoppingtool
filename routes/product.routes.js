const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");
const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");


//view products
router.get("/", isLoggedIn, (req, res, next) => {

 Product.find({user: req.session.user._id})
    .then(result => res.render("products/products-list", {result}))
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })

})

// create new product entry
router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("products/product-create");
})


router.post("/create", isLoggedIn, (req, res, next) => {
    const productDetails = {
        name: req.body.name,
        price: req.body.price,
        notes: req.body.notes, 
        image: req.body.image,
        link: req.body.link,
        user: req.session.user._id
      };

    Product.create(productDetails)
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})

// change product entry
router.get("/:productId/edit", isLoggedIn, (req, res, next) => {
    const { productId } = req.params
    
    Product.findById(productId)
        .then (productDetails => res.render("products/product-edit", productDetails))
        .catch( error => {
            console.log("Error while trying to reach DB", error);
            next(error);
        })
})


router.post("/:productId/edit", isLoggedIn, (req, res, next) => {
    const { productId } = req.params

    const productDetails = {
        name: req.body.name,
        price: req.body.price,
        notes: req.body.notes, 
        image: req.body.image,
        link: req.body.link
      };

    Product.findByIdAndUpdate(productId, productDetails)
      .then( () => res.redirect("/products"))
      .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


router.post("/:productId/delete", isLoggedIn, (req, res, next) => {
    const {productId} = req.params;
    
    Product.findByIdAndRemove(productId)
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})

module.exports = router;
