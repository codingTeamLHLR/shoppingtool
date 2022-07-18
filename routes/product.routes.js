const router = require("express").Router();
const mongoose = require("mongoose");

const Product = require("../models/Product.model");
const List = require("../models/List.model");


let list;
let maxPrice;



router.get("/", (req, res, next) => {
    let data = {} ;

    let filter = {};

    if(req.query.word) {
        filter.name = {"$regex": req.query.word, "$options": "i"}
      }

    if (req.query.maxPrice) {
        const price = parseFloat(req.query.maxPrice);
        filter.price = {$lte: price}
    }
    if (req.query.list) {
        const list = req.query.list;
        filter.list = list
    }

    List.find()
    .then( result => {
        data.lists = result;
        return Product.find(filter)
    })
    .then(result => {
        data.products = result;
        console.log(data);
        res.render("products/products-list", data)
    })
    .catch(error => {
        console.log("Error while trying to reach DB", error);
    })
})






// create new product entry
router.get("/create", (req, res, next) => {

    List.find()
        .then( lists => {
            res.render("products/product-create", {lists});
        })

})


router.post("/create", (req, res, next) => {
    const productDetails = {
        name: req.body.name,
        price: req.body.price,
        notes: req.body.notes, 
        image: req.body.image,
        link: req.body.link,
        list: req.body.list
      };

    Product.create(productDetails)
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})

// change product entry
router.get("/:productId/edit", (req, res, next) => {
    const { productId } = req.params
    
    Product.findById(productId)
        .then (productDetails => res.render("products/product-edit", productDetails))
        .catch( error => {
            console.log("Error while trying to reach DB", error);
            next(error);
        })
})


router.post("/:productId/edit", (req, res, next) => {
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


router.post("/:productId/delete", (req, res, next) => {
    const {productId} = req.params;
    
    Product.findByIdAndRemove(productId)
        .then( () => res.redirect("/products"))
        .catch(error => {
            console.log("Error while trying to reach DB", error);
        })
})







module.exports = router;
