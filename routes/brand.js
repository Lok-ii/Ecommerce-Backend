const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandData,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/", authMiddleware(["admin"]), createBrand);
router.get("/", getBrands);
router.get("/:brandId", getBrandData);
router.delete("/:brandId", authMiddleware(["admin"]), deleteBrand);
router.patch("/:brandId", authMiddleware(["admin"]), updateBrand);

module.exports = router;
