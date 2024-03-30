const cartModel = require("../models/cart.js");
const productModel = require("../models/products.js");
const { log } = require("console");

const createCart = async (req, res) => {
  log(req.body);

  const userCart = await cartModel.findOne({ userId: req.user._id });
  log(userCart);

  if (userCart) {
    // res.json({
    //     success: true,
    //     message: "Cart retrieved successfully"
    // })
  } else {
    let cartTotal = 0;
    let productsToAdd = [];
    for (let i = 0; i < req.body.products.length; i++) {
      const currentProduct = req.body.products[i];
      const { price } = await productModel.findById(currentProduct.productId, {
        price: 1,
        _id: 0,
      });
      log("PRODUCT DETAILS: ", i, price);

      const product = {
        ...currentProduct,
        price,
      };

      productsToAdd.push(product);
      const priceForProduct = currentProduct.quantity * price;
      cartTotal += priceForProduct;
    }

    await cartModel.create({
      products: productsToAdd,
      cartTotal: cartTotal,
      userId: req.user._id,
    });
  }
  res.json({
    success: true,
    message: "Cart created successfully",
  });
};

const getCart = async (req, res) => {
  const userCart = await cartModel.findOne({ userId: req.user._id });
  if (!userCart) return res.status(404).send("No Cart Found");
  res.json({
    success: true,
    message: "Cart retrieved successfully",
    data: userCart,
  });
};

module.exports = {
  createCart,
  getCart,
};
