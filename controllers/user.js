const userModel = require("../models/user.js");
const { log } = require("console");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegistration = async (req, res) => {
  log(req.body);

  try {
    const newUser = await new userModel(req.body); // create a new instance of the User model with the new user data from req.body
    const newUserInstance = await newUser.save(); // save the new user instance to the database
    res.json({
      success: true,
      message: "User registered successfully, login to continue",
    });
  } catch (error) {
    log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  } else {
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    log(isMatch);
    if (isMatch) {
      const expiryDateTime = Math.floor(new Date().getTime() / 1000) + 7200; // one hour validity for token
      const payload = {
        id: user._id,
        name: user.firstname,
        role: user.role,
        exp: expiryDateTime,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
      res.json({
        success: true,
        message: "User logged in successfully",
        token: token,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
  }
};

const userLogout = async (req, res) => {
  res.json({
    success: true,
    message: "Dummy Logout API",
  });
};

const saveUserAddress = async (req, res) => {
  const originalData = req.body;
  const setObject = {};
  if (originalData.address) {
    setObject["address.address"] = originalData.address;
  }

  if (originalData.city) {
    setObject["address.city"] = originalData.city;
  }

  if (originalData.state) {
    setObject["address.state"] = originalData.state;
  }

  if (originalData.pincode) {
    setObject["address.pincode"] = originalData.pincode;
  }

  const updateObject = {
    $set: setObject,
  };
  try {
    const updateResult = await userModel.findByIdAndUpdate(
      req.user._id,
      updateObject
    );
    res.json({
      success: true,
      message: "User address saved successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(res.statusCode).json({
      success: false,
      message: err.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const updateObject = {
      $push: {
        wishlist: req.body.productId,
      },
    };
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, updateObject);
    log(updatedUser)
    res.json({
      success: true,
      message: "Item added to wishlist",
    });
  } catch (error) {
    log(error);
    res.status(res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try{
    const user = await userModel.findById(req.user._id).populate("wishlist", "title price description brand");
    res.json({
      success: true,
      message: "Wishlist has been successfully retrieved.",
      wishlist: user.wishlist,
    });
  }catch(error) {
    log(error);
    res.status(res.statusCode).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  userLogin,
  userRegistration,
  userLogout,
  saveUserAddress,
  addToWishlist,
  getWishlist
};
