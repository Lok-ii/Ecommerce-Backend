const categoryModel = require("../models/category.js");

const createProductCategory = async (req, res) => {
  try {
    const newProductCategory = await new categoryModel(req.body);
    const productCategory = await newProductCategory.save();
    res.status(201).json({
      success: true,
      message: "Product category created successfully",
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductCategories = async (req, res) => {
  try {
    const productCategories = await categoryModel.find().populate("products");
    res.status(200).json({
      success: true,
      message: "Product categories retrieved successfully",
      productCategories: productCategories,
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductCategoryData = async (req, res) => {
  try {
    const productCategory = await categoryModel.findById(req.params.categoryId).populate("products");
    res.status(200).json({
      success: true,
      message: "Product category retrieved successfully",
      productCategory: productCategory,
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProductCategory = async (req, res) => {
    try {
      const updatedProductCategory = await categoryModel.findByIdAndUpdate(
        req.params.categoryId,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Product category updated successfully",
        productCategory: updatedProductCategory,
      });
    } catch (error) {
      log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

const deleteProductCategory = async (req, res) => {
    try {
      const deletedProductCategory = await categoryModel.findByIdAndDelete(
        req.params.categoryId
      );
      res.status(200).json({
        success: true,
        message: "Product category deleted successfully",
        productCategory: deletedProductCategory,
      });
    } catch (error) {
      log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategoryData,
  updateProductCategory,
  deleteProductCategory
};