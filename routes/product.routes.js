const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");
const List = require("../models/List.model");

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");
const getFilter = require("../utils/getFilter")

const metascraper = require('metascraper')([
    require('metascraper-amazon')(),
    require('@samirrayani/metascraper-shopping')(),
    require('metascraper-title')(),
    require('metascraper-image')(),
    require('metascraper-url')(),
]);
const got = require('got');


//view products
router.get("/", isLoggedIn, (req, res, next) => {

    let filter = getFilter(req);
    let data = {} ;

    data.filter = filter;

    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;

        return Product.find(filter);
    })
    .then(result => {
        data.products = result;
        res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


router.get("/create", isLoggedIn, (req, res, next) => {

    let filter = getFilter(req);
    let data = {} ;

    data.showCreateModal = true;

    data.filter = filter;

    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;

        return Product.find(filter);
    })
    .then(result => {
        data.products = result;
        res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


router.post("/create", isLoggedIn, (req, res, next) => {

    'use strict'
    
    const goShopping = async () => {
      const targetUrl = req.body.link;
      const { body: html, url } = await got(targetUrl);
      const metadata = await metascraper({ html, url });

      console.log(metadata);
    
    const productDetails = {
        name: metadata.title,
        price: metadata.price,
        notes: req.body.notes, 
        image: metadata.image,
        link: metadata.url,
        list: req.body.list,
        user: req.session.user._id
      };

    Product.create(productDetails)
        .then( result => {
            res.redirect(`${result._id}/edit`)
        })
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
    };
    
    goShopping()
        .catch(error => {
            console.log("Error creating product from link", error);
            const productDetails = { user: req.session.user._id };
            return Product.create(productDetails);
            })
        .then( product => {
            console.log(product)
            const error =  {errorMessage: "Error creating product from link. Please enter details manually."}
            res.redirect(`${product._id}/edit`)
        }) 
        .catch(error => {
            console.log("Error creating product from link", error);
        })

})


// create new product entry manually
router.get("/create-manually", isLoggedIn, (req, res, next) => {

    const productDetails = { user: req.session.user._id };

    Product.create(productDetails)
    .then( product => {
        res.redirect(`${product._id}/edit`)
    })
    .catch(error => {
        console.log("Error creating product from link", error);
    })

})

router.get("/:productId/edit", isLoggedIn, (req, res, next) => {

    const { productId } = req.params

    let data = {} ;
    
    data.showEditModal = true;

    let filter = getFilter(req);
    
    data.filter = filter;
    
    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;
    
        return Product.find(filter);
    })
    .then(result => {
        data.products = result;
        return Product.findById(productId);
    })
    .then (productDetails => {
        data.product = productDetails;
        res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})




router.post("/:productId/edit", isLoggedIn, (req, res, next) => {
    const { productId } = req.params

    const productDetails = {
        name: req.body.name,
        price: req.body.price,
        notes: req.body.notes, 
        image: req.body.image,
        link: req.body.link,
        list: req.body.list
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
