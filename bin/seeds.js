const mongoose = require('mongoose');
const List = require('../models/List.model');
const Product = require('../models/Product.model');

const MONGO_URI = require("../utils/consts");


//sample lists and products
const lists = [
    {
        name: "My Favorites",
        description: "My favorite Products."
    }, 
    {
        name: "Clothes",
        description: "List of clothes on my shopping list."
    },
    {
        name: "Accessories",
        description: "Accessories I would like to buy."
    },
    {
        name: "Home",
        description: "Things I need for my home."
    }, 
    {
        name: "Christmas Presents",
        description: "Presents for my loved ones."
    }
];

// const products = [
//   {
//     name: "Example Product",
//     price: 50,
//     notes: "This will be your favorite products.", 
//     list: 
//   }
// ];


mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    // const listsPromise = List.create(lists);
    // const productsPromise = Product.create(products);

    // return Promise.all([listsPromise, productsPromise])
    return List.create(lists)
  })
  .then(result => {
    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(`An error occurred while creating books from the DB: ${err}`)
  });