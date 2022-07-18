const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const productSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    notes: String, 
    image: String,
    link: String,
    list: {
        type: Schema.Types.ObjectId,
        ref: "List"
      }
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
