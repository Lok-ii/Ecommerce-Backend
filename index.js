const express = require("express");
const { log } = require("console");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const RateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");
const path = require("node:path");
// const { fileURLToPath } = require("node:url");


const authMiddleware = require("./middlewares/auth.js");

const userRouter = require("./routes/user.js");
const productRouter = require("./routes/products.js");
const cartRouter = require("./routes/cart.js");
const couponRouter = require("./routes/coupon.js");
const orderRouter = require("./routes/order.js");
const blogRouter = require("./routes/bolg.js");
const brandRouter = require("./routes/brand.js");
const categoryRouter = require("./routes/category.js");

dotenv.config();


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

// const limiter = RateLimit({
//   store: new MongoStore({
//   uri: process.env.ATLAS_STRING,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   collection: "ecommerce",
//   // should match windowMs
//   expireTimeMs: 15 * 60 * 1000,
//   errorHandler: console.error.bind(null, 'rate-limit-mongo')
//   // see Configuration section for more options and details
// }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000 // limit each IP to 100 requests per windowMs
// })

app.use(cors());
// app.use(limiter)
app.use(express.json());
mongoose
  .connect(process.env.ATLAS_STRING)
  .then(() => {
    log("Connected Successfully to the database");
  })
  .catch((err) => {
    log("Error connecting to the database: " + err.message);
  });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/order",authMiddleware(["buyer", "admin"]), orderRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/", (req, res)=> {
  res.sendFile(__dirname + "/index.html");
})

// Handling all other routes
app.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
