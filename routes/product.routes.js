const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");
const List = require("../models/List.model");

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");

const metascraper = require('metascraper')([
    require('metascraper-amazon')(),
    require('@samirrayani/metascraper-shopping')(),
    require('metascraper-title')(),
    require('metascraper-image')(),
    require('metascraper-url')(),
]);
const got = require('got');

let list;
let maxPrice;

//view products
router.get("/", isLoggedIn, (req, res, next) => {

    let filter = {};
    let data = {} ;

    filter.user = req.session.user._id

    if(req.query.word) {
        filter.name = {"$regex": req.query.word, "$options": "i"}
    }
    if(!req.query.word) {
        delete filter.name;
    }

    if (req.query.maxPrice) {
        const price = parseFloat(req.query.maxPrice);
        filter.price = {$lte: price}
    }
    if (!req.query.maxPrice) {
        delete filter.price;
    }

    if (req.query.list && req.query.list != "null") {
        const list = req.query.list;
        filter.list = list
    }
    if (req.query.list && req.query.list == "null") {
        delete filter.list
    }

    data.filter = filter;

    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;

        return Product.find(filter);
    })
    //.populate("list")
    .then(result => {
        data.products = result;
        res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})

// create new product entry with link
// router.get("/create", isLoggedIn, (req, res, next) => {

//     List.find({user: req.session.user._id})
//         .then( lists => {
//             res.render("products/product-create", {lists});
//         })

// })

router.get("/create", isLoggedIn, (req, res, next) => {
    let filter = {};
    let data = {} ;

    data.showCreateModal = true;

    filter.user = req.session.user._id

    if(req.query.word) {
        filter.name = {"$regex": req.query.word, "$options": "i"}
    }
    if(!req.query.word) {
        delete filter.name;
    }

    if (req.query.maxPrice) {
        const price = parseFloat(req.query.maxPrice);
        filter.price = {$lte: price}
    }
    if (!req.query.maxPrice) {
        delete filter.price;
    }

    if (req.query.list && req.query.list != "null") {
        const list = req.query.list;
        filter.list = list
    }
    if (req.query.list && req.query.list == "null") {
        delete filter.list
    }

    data.filter = filter;

    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;

        return Product.find(filter);
    })
    .then(result => {
        data.products = result;
        console.log(data);
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
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
    };
    
    goShopping()
        .catch(error => {
            console.log("Error creating product from link", error);
            return res.status(400).render("products/product-create-manually", {
                errorMessage: "Error creating product from link. Please enter details manually.",
            });
        })

})


// create new product entry manually
router.get("/create-manually", isLoggedIn, (req, res, next) => {

    List.find({user: req.session.user._id})
        .then( lists => {
            res.render("products/product-create-manually", {lists});
        })

})


router.post("/create-manually", isLoggedIn, (req, res, next) => {

    const productDetails = {
        name: req.body.name,
        price: req.body.price,
        notes: req.body.notes, 
        image: req.body.image,
        link: req.body.link,
        list: req.body.list,
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

    data = {}

    List.find({user: req.session.user._id})
        .then( lists => {
            data.lists = lists;
            return Product.findById(productId)
        })
        .then (productDetails => {
            data.product = productDetails;
            console.log(data);
            res.render("products/product-edit", data)
        })
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
