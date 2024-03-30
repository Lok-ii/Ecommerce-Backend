const express = require("express");
const {
  userLogout,
  userLogin,
  userRegistration,
  saveUserAddress,
  addToWishlist,
  getWishlist
} = require("../controllers/user.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/register", userRegistration);

router.post("/login", userLogin);

router.post("/logout", userLogout);

router.post(
  "/address",
  authMiddleware(["admin", "seller", "buyer"]),
  saveUserAddress
);

router.post("/wishlist", authMiddleware(["admin", "seller", "buyer"]), addToWishlist);

router.get("/wishlist", authMiddleware(["admin", "seller", "buyer"]), getWishlist);

module.exports = router;
