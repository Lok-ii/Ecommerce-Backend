const dayjs = require("dayjs");
const { log } = require("console");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
const orderModel = require("../models/order.js");
const cartModel = require("../models/cart.js");
const couponModel = require("../models/coupon.js");

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  /**
   * 1. Extract user cart by userId
   * 2. Get cart total and apply coupon (if available) => payableAmount
   * 3. Check the mode of payment (If COD, skip payment else Redirect user to payment gateway)
   * 4. Check the delivery address (if give in body, use it, else fetch it from the user's saved address)
   * 5. Delete the user cart on successful order
   * 6. Inventory / Stock values to be updated
   */

  const userCart = await cartModel.findOne({ userId: req.user._id });
  if (!userCart) {
    return res.json({
      success: false,
      message: "Cart is empty, Please add items to cart",
    });
  }

  const couponCode = req.body.coupon;
  const coupon = await couponModel.findOne({ couponCode, isActive: true });
  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: "Invalid Coupon Code",
    });
  }

  /**
   * Is coupon between start and end dateof the coupon
   */

  const couponStartDate = dayjs(coupon.startDate);
  const couponEndDate = dayjs(coupon.endDate);
  const currentDateTime = dayjs();

  if (
    currentDateTime.isBefore(couponStartDate) ||
    currentDateTime.isAfter(couponEndDate)
  ) {
    return res.status(400).json({
      success: false,
      message: "Coupon expired",
    });
  }

  let couponDiscountInRs = (
    (userCart.cartTotal / 100) *
    coupon.discountPercentage
  ).toFixed(2);

  if (couponDiscountInRs > coupon.maxDiscountInRs) {
    couponDiscountInRs = coupon.maxDiscountInRs;
  }

  const amount = (userCart.cartTotal - couponDiscountInRs).toFixed(2);

  
  let deliveryAddress = req.body.deliveryAddress;
  
  if (deliveryAddress) {
      deliveryAddress = req.user.address;
    }
    
    const deliveryDate = dayjs().add(7, "days");
    // POSSIBLE ORDER STAUS : PLACED, PACKED, SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RETURNED, REFUND_AWAITED, REFUND_INITIATED, REFUND_RECIEVED
    const orderDetails = {
        cart: userCart,
        userId: req.user._id,
        amount,
        deliveryAddress,
        modeOfPayment: req.body.modeOfPayment,
        transactionId: req.body.transactionId ? req.body.transactionId : null,
        coupon: coupon._id,
        orderDate: currentDateTime,
        deliveryDate,
        orderStatus: "PLACED",
        modeOfPayment: req.body.modeOfPayment,
    };
    
    const newOrder = await orderModel.create(orderDetails);

    let pgResponse;
    
    if (req.body.modeOfPayment === "COD") {
      // Don't generate transaction ID and don't redirect to payment gateway
    } else {
      // TODO: Redirect the user to payment gateway
      const options = {
          amount: amount * 100, //Amount in paisa Eg. 50Rs = 5000 paisa
          currency: "INR",
          receipt: newOrder._id, // Unique Order ID
          payment_capture: 1, // Ignore for now
      }

      try{
        pgResponse = await razorpay.orders.create(options);
        log("RAZORPAY RESPONSE: ", pgResponse)
        
      }catch(error){
        log(error);
        return  res.status(422).json({
            success: false,
            message:"Error while processing your request",
        })
      }
    }
    razorpay.payments
  .all({
    from: '2024-03-1',
    to: '2024-03-18',
  })
  .then(response => {
    // handle success
    log(response);
  })
  .catch(error => {
    // handle error
  });
  res.json({
    success: true,
    message: "Order created successfully",
    orderDetails: newOrder._id,
    paymentInformation: {
        amount: pgResponse.amount_due,
        orderId: pgResponse.id,
        currency: pgResponse.currency,
    }
  });
};

const getAllOrders = async (req, res) => {
  const allOrders = await orderModel.find({});
  res.json({
    success: true,
    message: "Orders retrieved successfully",
    data: allOrders,
  });
};

module.exports = {
  getAllOrders,
  createOrder,
};
