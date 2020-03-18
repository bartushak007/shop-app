const ProductsModel = require("../models/Products");
const jwt = require("jsonwebtoken");

class Products {
  async getProducts(req, res, next) {
    try {
      const { token, id } = { ...body, ...query, ...params };
      const jwtData = jwt.verify(token, process.env.JWT_KEY);
      const products = await ProductsModel.find({ id, user_id: jwtData.id });

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e || "Server Error"
      });
    }
  }

  async updateProduct(req, res, next) {
    const { body, query, params } = req;
    const {
      id,
      user_id,
      productName,
      description,
      urlImage,
      quantity,
      added,
      characteristic,
      price,
      asset
    } = { ...body, ...query, ...params };
    try {
      const product = await ProductsModel.find({ _id: id, user_id });
      const updatedProduct = await ProductsModel.updateOne(
        { _id: id, user_id },
        {
          ...product,
          productName,
          description,
          urlImage,
          quantity,
          added,
          characteristic,
          price,
          asset
        }
      );

      res.status(200).json({
        success: true,
        data: updatedProduct
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  }
  async getProductsByUSerID(req, res, next) {
    try {
      const { body, query, params } = req;
      const { token, id } = { ...body, ...query, ...params };
      const jwtData = jwt.verify(token, process.env.JWT_KEY);
      if (jwtData.id !== id) throw new Error("do not logined");
      const product = await ProductsModel.find({ user_id: id });
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e || "Server Error"
      });
    }
  }

  async getProduct(req, res, next) {
    const { body, query, params } = req;
    const { id } = { ...body, ...query, ...params };
    try {
      const product = await ProductsModel.find({ _id: id });
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: "Server Error"
      });
    }
  }
  async addProduct(req, res, next) {
    const { body, query, params } = req;
    try {
      const {
        productName,
        description,
        urlImage,
        quantity,
        added,
        characteristic,
        price,
        asset,
        user_id
      } = { ...body, ...query, ...params };

      const products = await ProductsModel.find({ productName });

      if (products.length)
        return res.status(400).json({
          success: false,
          error: "productName alredy exist"
        });

      const addProduct = await ProductsModel.create({
        productName,
        description,
        urlImage,
        quantity,
        added,
        characteristic,
        price,
        asset,
        user_id
      });

      const { _id } = addProduct;

      res.status(200).json({
        success: true,
        data: addProduct
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(val => val.message);

        return res.status(400).json({
          success: false,
          error: messages
        });
      } else {
        return res.status(500).json({
          success: false,
          error: "Server Error"
        });
      }
    }
  }
}

module.exports = new Products();
