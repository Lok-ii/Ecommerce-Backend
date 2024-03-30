const couponModel = require("../models/coupon.js");
const {log} = require("console");

const createCoupon = async (req, res) => {
    log(req.body);
    try {
        const newCoupon = await couponModel.create(req.body);
        const coupon = await newCoupon.save();
        res.json({
            success: true,
            message: "Coupon created successfully",
        })
    } catch (error) {
        log(error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}

const getCoupons = async (req, res) => {
    const coupons = await couponModel.find({isActive: true});
    log(coupons);
    res.json({
        success: true,
        message: "Coupons retrieved successfully",
        coupons: coupons
    })
}

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Coupon deleted successfully",
        })
    } catch (error) {
        log(error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}

const updateCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.findById(req.params.id);
        const updatedCoupon = {...coupon._doc, ...req.body};
        log(updatedCoupon)
        const updateCoupon = await couponModel.updateOne({_id: req.params.id}, updatedCoupon)
        res.json({
            success: true,
            message: "Coupon updated successfully",
        })
    } catch (error) {
        log(error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    createCoupon,
    getCoupons,
    deleteCoupon,
    updateCoupon
};