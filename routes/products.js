const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  getProductsByUSerID,
  deleteListOfProducts
} = require("../controllers/products");

router
  .route("/")
  .get(getProducts)
  .post(addProduct)
  .delete(deleteListOfProducts);

router
  .route("/userid/:id")
  .get(getProductsByUSerID)
  
router
  .route("/:id")
  .get(getProduct)
  .put(updateProduct);

module.exports = router;
