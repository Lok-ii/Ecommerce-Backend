const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");
const {log} = require("console");

const authMiddleware = (role) => async (req, res, next) => {
  const payload = jwt.decode(req.headers.authorization);
  try {
    const tokenFromHeaders = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(
      tokenFromHeaders,
      process.env.JWT_SECRET_KEY
    );
    // console.log(tokenFromHeaders);
    const payload = jwt.decode(tokenFromHeaders);
    if (role.includes(payload.role)) {
      const user = await userModel.findById(payload.id);
      // log(user);
      req.user = user;
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden: " + error.message,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(403).json({
      success: false,
      message: "Forbidden: " + error.message,
    });
  }
};

module.exports = authMiddleware;
