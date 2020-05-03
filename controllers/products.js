const ProductsModel = require("../models/Products");
const jwt = require("jsonwebtoken");

class Products {
  async getProducts(req, res, next) {
    try {
      const { body, query, params } = req;
      const { page = 0, limit = 5 } = {
        ...body,
        ...query,
        ...params,
      };
      const products = await ProductsModel.find({})
        // .sort({ added: -1 })
        .skip(page * limit)
        .limit(limit);
      const quantity = await ProductsModel.countDocuments({});

      res.status(200).json({
        success: true,
        data: {
          products,
          quantity,
          limit,
          page,
          sortParams: ["dateUp", "dateDown", "priceUp", "priceDown"],
        },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e || { message: "Server Error" },
      });
    }
  }

  async updateProduct(req, res, next) {
    const { body, query, params } = req;
    const {
      id,
      productName,
      description,
      urlImage,
      quantity,
      added,
      characteristic,
      price,
      asset,
    } = { ...body, ...query, ...params };

    try {
      const jwtData = jwt.verify(token, process.env.JWT_KEY);
      const product = await ProductsModel.find({
        _id: id,
        user_id: jwtData.id,
      });

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
          asset,
        }
      );

      res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e,
      });
    }
  }
  async getProductsByUSerID(req, res, next) {
    try {
      const { body, query, params } = req;
      const { token, page = 0, limit = 5 } = {
        ...body,
        ...query,
        ...params,
      };

      const jwtData = jwt.verify(token, process.env.JWT_KEY);

      const products = await ProductsModel.find({ user_id: jwtData.id })
        .sort({ added: -1 })
        .skip(page * limit)
        .limit(limit);
      const quantity = await ProductsModel.countDocuments({ user_id: jwtData.id });

      res.status(200).json({
        success: true,
        data: { products, quantity, limit, page },
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e || { message: "Server Error" },
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
        data: product,
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: { message: "Invalid product id" },
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
        added = new Date().valueOf(),
        characteristic,
        price,
        asset,
        user_id,
      } = { ...body, ...query, ...params };

      const products = await ProductsModel.find({ productName });

      if (products.length)
        return res.status(400).json({
          success: false,
          error: { message: "productName alredy exist" },
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
        user_id,
      });

      const { _id } = addProduct;

      res.status(200).json({
        success: true,
        data: addProduct,
      });
    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((val) => val.message);

        return res.status(400).json({
          success: false,
          error: messages,
        });
      } else {
        return res.status(500).json({
          success: false,
          error: { message: "Server Error" },
        });
      }
    }
  }

  async deleteListOfProducts(req, res, next) {
    const { body, query, params } = req;
    const { ids, token } = { ...body, ...query, ...params };

    try {
      const jwtData = jwt.verify(token, process.env.JWT_KEY);

      const deleted =
        jwtData.role !== "client"
          ? await ProductsModel.remove(
              ...ids.reduce((acc, _id) => [...acc, { _id }], [])
            )
          : await ProductsModel.remove(
              ...ids.reduce(
                (acc, _id) => [...acc, { _id, user_id: jwtData.id }],
                []
              )
            );

      if (!deleted.deletedCount) {
        return res.status(400).json({
          success: false,
          error: { message: "Wrong data" },
        });
      }

      res.status(200).json({
        success: true,
        data: deleted,
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        error: e,
      });
    }
  }
}

module.exports = new Products();
