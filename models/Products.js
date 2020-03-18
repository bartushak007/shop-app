const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "productName is required"]
  },
  description: {
    type: String
  },
  urlImage: {
    type: String
  },
  quantity: {
    type: Number,
    required: [true, "secondName is required"]
  },
  added: {
    type: String,
    required: [true, "date is required"]
  },
  characteristic: {
    type: String
  },
  price: {
    type: Number
  },
  asset: {
    type: String
  },
  user_id: { 
    type: String, 
    required: [true, "user id is required"] 
  }
});

module.exports = mongoose.model("Products", ProductsSchema);
