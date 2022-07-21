const mongoose = require('mongoose');
const List = require('../models/List.model');

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

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);

    return List.create(lists)
  })
  .then(result => {
    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(`An error occurred while creating lists from the DB: ${err}`)
  });