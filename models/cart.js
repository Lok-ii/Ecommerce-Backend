const mongoose = require('mongoose');


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
        type: [cartProductSchema]
    },
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
    },
    cartTotal : {
        type: Number,
        required: false,
        default: 0,
    }
});

const cartModel = mongoose.model('cart', cartSchema);

module.exports = cartModel;