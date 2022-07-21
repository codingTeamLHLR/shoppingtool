const router = require("express").Router();
const mongoose = require("mongoose");

const List = require("../models/List.model");
const Product = require("../models/Product.model");

const User = require("../models/User.model");

const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");
const getFilter = require("../utils/getFilter")



router.get("/listview", isLoggedIn, (req, res, next) =>     {

    let filter = getFilter(req);
    let data = {} ;

    data.showListviewModal = true;

    data.filter = filter;

    List.find({user: req.session.user._id})
        .then( result => {
            data.lists = result;

            return Product.find(filter)
        .then(result => {
            data.products = result;
            res.render("products/products-list", {data})
        })
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
    })
})


router.get("/create", isLoggedIn, (req, res, next) => {
    
    const listDetails = { user: req.session.user._id };

    List.create(listDetails)
    .then( list => {
        res.redirect(`/lists/${list._id}/edit`)
    })
    .catch(error => {
        console.log("Error creating list", error);
    })
})


router.get("/:listId/edit", isLoggedIn, (req, res, next) => {

    const { listId } = req.params

    let filter = getFilter(req);
    let data = {} ;

    data.showListDetailsModal = true;

    data.filter = filter;

    List.find({user: req.session.user._id})
    .then( result => {
        data.lists = result;

        return Product.find(filter);
    })
    .then(result => {
        data.products = result;
        
        return List.findById(listId)
    })
    .then((list) => {
    data.list = list;
       res.render("products/products-list", {data})
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


router.post("/:listId/edit", isLoggedIn, (req, res, next) => {
    const { listId } = req.params

    const listDetails = {
        name: req.body.name,
        description: req.body.description,
        user: req.session.user._id
    };

    List.findByIdAndUpdate(listId, listDetails)
      .then( () => res.redirect("/lists/listview"))
      .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})


router.get("/:listId/delete", isLoggedIn, (req, res, next) => {
    const {listId} = req.params;
    
    Product.deleteMany({list: listId})
        .then(() => {
            return List.findByIdAndRemove(listId)
        })
        .then( () => res.redirect("/lists/listview"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})



module.exports = router;
