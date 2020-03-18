const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  getProductsByUSerID
} = require("../controllers/products");

router
  .route("/")
  .get(getProducts)
  .post(addProduct);

router
  .route("/userid/:id")
  .get(getProductsByUSerID)
  
router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct);

module.exports = router;
