const express = require('express');
const {createOrder, getAllOrders} = require("../controllers/order.js");

const router = express.Router();


router.post("/", createOrder);

router.get("/", getAllOrders);

router.post("/payment/payment-status", (req, res) => {
    const body = req.body;
})


module.exports = router;