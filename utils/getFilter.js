let filter = {};


let getFilter = function (req, next) {
  
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

    return filter;
  };
  

  module.exports = getFilter;
