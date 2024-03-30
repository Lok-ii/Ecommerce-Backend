const express = require("express");
const {
  createProductCategory,
  getProductCategories,
  getProductCategoryData,
  updateProductCategory,
  deleteProductCategory,
} = require("../controllers/category.js");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware(["admin"]), createProductCategory);
router.get("/", getProductCategories);
router.get("/:categoryId", getProductCategoryData);
router.delete("/:categoryId", authMiddleware(["admin"]), deleteProductCategory);
router.patch("/:categoryId", authMiddleware(["admin"]), updateProductCategory);

module.exports = router;