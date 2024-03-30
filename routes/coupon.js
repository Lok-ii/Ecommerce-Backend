const express = require('express');
const { createCoupon, getCoupons, deleteCoupon, updateCoupon } = require("../controllers/coupon.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/", authMiddleware(["admin"]) , createCoupon);

router.get("/", getCoupons);

router.delete("/:id", authMiddleware(["admin"]), deleteCoupon);

router.patch("/:id", authMiddleware(["admin"]), updateCoupon);


module.exports = router;