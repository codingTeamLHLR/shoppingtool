const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const productSchema = new Schema(
  {
    name:  String,
    price: {
        type: Number,
    },
    notes: String, 
    image: String,
    link: String,
    list: {
        type: Schema.Types.ObjectId,
        ref: "List"
      },
    user: {type: Schema.Types.ObjectId, ref: 'User'}
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
