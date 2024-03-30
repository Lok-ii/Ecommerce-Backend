const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users" // this is a reference to the User model in our models folder
    }
})

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true  //remove the extra spaces from start and end of string
    },
    description:{
        type:String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
       type : String,
       required : true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "users"
    },
    likesCount: {
        type: Number,
        required: false,
        default: 0
    },
    reviews: {
        type: [reviewSchema]
    }
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;