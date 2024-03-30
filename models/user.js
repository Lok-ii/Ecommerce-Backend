const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema,
    },
    wishlist: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "product",
    }

})


userSchema.pre("save", function() {
    console.log(this.password)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
})

const userModel = mongoose.model('users', userSchema);


module.exports = userModel;