const productModel = require("../models/products.js");
const { log } = require("console");
const jwt = require("jsonwebtoken");

const createProduct = async (req, res) => {
  // log(req.headers.authorization);
  try {
    const newProduct = await new productModel(req.body);
    const product = await newProduct.save();
    // console.log(newProduct);
    res.status(201).json({
      success: true,
      message: "Product created successfully wwith product id: " + product._id,
    });
  } catch (err) {
    log(err);
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  const allProducts = await productModel.find({});
  res.json({
    success: true,
    message: "The products are here",
    data: allProducts,
  });
};

const getProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const product = await productModel.findById(productId).populate([
      { path: "likes", select: "firstname lastname" }, // Adjust fields as needed
      { path: "dislikes", select: "firstname lastname" }, // Adjust fields as needed
    ]);
    res.json({
      success: true,
      message: "The product is here",
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  // const payload = jwt.decode(req.headers.authorization)
  // try {
  //     const data = await productModel.findById()
  // } catch (error) {
  // }
};

const likeDislikeController = async (req, res) => {
  log(req.user);
  let message = "";
  let updateObject = {};
  try {
    const product = await productModel.findById(req.params.productId);

    if (req.params.action === "likes" && product.likes.includes(req.user._id)) {
      updateObject = {
        $pull: {
          likes: req.user._id,
        },
        $inc: {
          likesCount: -1,
        },
      };
      message = "like removed successfully";
    } else if (
      req.params.action === "dislikes" &&
      product.dislikes.includes(req.user._id)
    ) {
      updateObject = {
        $pull: {
          dislikes: req.user._id,
        },
        $inc: {
          likesCount: 0,
        },
      };
      message = "dislike removed successfully";
    } else if (
      req.params.action === "likes" &&
      product.dislikes.includes(req.user._id)
    ) {
      updateObject = {
        $pull: {
          dislikes: req.user._id,
        },
        $push: {
          likes: req.user._id,
        },
        $inc: {
          likesCount: 1,
        },
      };
      message = "like added successfully";
    } else if (
      req.params.action === "dislikes" &&
      product.likes.includes(req.user._id)
    ) {
      updateObject = {
        $pull: {
          likes: req.user._id,
        },
        $push: {
          dislikes: req.user._id,
        },
        $inc: {
          likesCount: -1,
        },
      };
      message = "dislike added successfully";
    } else {
      let increase = 1;
      if (req.params.action === "dislikes") {
        increase = 0;
      }
      updateObject = {
        $push: {
          [req.params.action]: req.user._id,
        },
        $inc: {
          likesCount: increase,
        },
      };
      message = `${req.params.action} added successfully`;
    }
    const updatedProduct = await productModel.updateOne(
      { _id: req.params.productId },
      updateObject
    );
    res.json({
      success: true,
      message: message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const reviewProduct = async (req, res) => {
  log(req.body);
  // res.json({
  //   success: true,
  //   message: "review added successfully",
  // })
  try {
    const product = await productModel.findById(req.params.productId);

    const reviewExist = product.reviews.find(
      (review) => review.userId.toString() === req.user._id.toString()
    );
    log(reviewExist);

    if (reviewExist) {
      log("REVIEW EXISTS");

      const updateObject = {
        reviews: {
          $elemMatch: reviewExist,
        },
        $set: {
          "reviews.$.rating": req.body.rating,
          "reviews.$.comment": req.body.comment,
        },
      };
      const updatedReview = await productModel.updateOne(updateObject, {
        new: true,
      });
      log(updatedReview)
      res.json({
        success: true,
        message: "review updated successfully",
      });
    } else {
      const updatedReview = await productModel.findByIdAndUpdate(
        req.params.productId,
        {
          $push: {
            reviews: {
              ...req.body,
              userId: req.user._id,
            },
          },
        }
      );
      res.json({
        success: true,
        message: "review added successfully",
      });
    }
  } catch (error) {
    res.status(res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  editProduct,
  likeDislikeController,
  getProduct,
  reviewProduct,
};
