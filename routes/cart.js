const express = require('express');
const { createCart, getCart } = require("../controllers/cart.js");
const authMiddleware = require('../middlewares/auth.js');

const router = express.Router();

router.post("/", authMiddleware(["admin", "seller", "buyer"]), createCart);
router.get("/", authMiddleware(["admin", "seller", "buyer"]), getCart);

module.exports = router;