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


router.get("/listview", isLoggedIn, (req, res, next) =>     {

    let filter = {};
    let data = {} ;

    data.showListviewModal = true;

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

            return Product.find(filter)
        .then(result => {
            data.products = result;
            //console.log(data);
            res.render("products/products-list", {data})
        })
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
    })
})

router.get("/:listId/edit", isLoggedIn, (req, res, next) => {

    const { listId } = req.params

    let filter = {};
    let data = {} ;
    
    data.showListEditModal = true;
    
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
        return Product.findById(productId);
    })
    .then (productDetails => {
        data.product = productDetails;
        console.log(data);
        res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


// router.post("/:listId/edit", isLoggedIn, (req, res, next) => {
//     const { listId } = req.params

//     const listDetails = {
//         name: req.body.name,
//         description: req.body.description,
//       };

//     List.findByIdAndUpdate(listId, listDetails)
//       .then( () => res.redirect("/products/products-list"))
//       .catch(error => {
//         console.log("Error while trying to reach DB", error);
//     })
// })


// router.post("/:listId/delete", isLoggedIn, (req, res, next) => {
//     const {listId} = req.params;
    
//     Product.findByIdAndRemove(listId)
//         .then( () => res.redirect("products/products-list"))
//         .catch(error => {
//             console.log("Error while trying to reach DB", error);
//         })
// })



module.exports = router;
