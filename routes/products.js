const express = require("express");
const {
  createProduct,
  getAllProducts,
  editProduct,
  likeDislikeController,
  getProduct,
  reviewProduct,
} = require("../controllers/products.js");
const authMiddleware = require("../middlewares/auth.js");
const router = express.Router();

router.post("/", authMiddleware(["admin"]), createProduct);

router.get("/", authMiddleware(["admin", "buyer", "seller"]), getAllProducts);

router.patch("/", authMiddleware(["seller"]), editProduct);

router.post(
  "/review/:productId",
  authMiddleware(["admin", "buyer", "seller"]),
  reviewProduct
);

router.post(
  "/:action/:productId",
  authMiddleware(["admin", "buyer", "seller"]),
  likeDislikeController
);

router.get("/:productId", getProduct);

module.exports = router;
