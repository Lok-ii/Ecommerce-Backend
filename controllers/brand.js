const brandModel = require("../models/brand.js");
const { log } = require("console");

const createBrand = async (req, res) => {
  try {
    const newBrand = await new brandModel(req.body);
    const brand = await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await brandModel.find().populate("products");
    res.status(200).json({
      success: true,
      message: "Brands retrieved successfully",
      brands: brands,
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBrandData = async (req, res) => {
  try {
    const brand = await brandModel.findById(req.params.brandId).populate("products");
    res.status(200).json({
      success: true,
      message: "Brand retrieved successfully",
      brand: brand,
    });
  } catch (error) {
    log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBrand = async (req, res) => {
    try {
      const updatedBrand = await brandModel.findByIdAndUpdate(
        req.params.brandId,
        req.body,
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
      });
    } catch (error) {
      log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

const deleteBrand = async (req, res) => {
    try {
      const deletedBrand = await brandModel.findByIdAndDelete(
        req.params.brandId
      );
      res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
        brand: deletedBrand,
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
  createBrand,
  getBrands,
  getBrandData,
  updateBrand,
  deleteBrand
};
