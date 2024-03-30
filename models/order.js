const mongoose = require("mongoose");
// const addressSchema = require("../models/user.js");

const cartProductSchema = new mongoose.Schema({
    productId: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    color: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    }
})

const cartSchema = new mongoose.Schema({
  products: {
    type: [cartProductSchema],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: false,
    default: 0,
  },
});

const addressSchema = new mongoose.Schema({
    address: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    city: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    state: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    pincode: {
        type: String,
        required: false,
        default: "",
        trim: true
    }
});

const orderSchema = new mongoose.Schema({
  cart: {
    type: cartSchema,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null,
  },
  deliveryAddress: {
    type: addressSchema,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
  },
  modeOfPayment: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: false,
    default: ""
  },

});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
