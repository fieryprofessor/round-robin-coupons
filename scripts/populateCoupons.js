const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Coupon = require("../models/Coupon");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    const sampleCoupons = [
      { code: "COUPON1" },
      { code: "COUPON2" },
      { code: "COUPON3" },
      { code: "COUPON4" },
      { code: "COUPON5" },
      { code: "COUPON6" },
      { code: "COUPON7" },
      { code: "COUPON8" },
      { code: "COUPON9" },
      { code: "COUPON10" },
    ];

    await Coupon.insertMany(sampleCoupons);
    console.log("Coupons added!");
    mongoose.disconnect();
  })
  .catch(err => console.log("MongoDB Connection Error:", err));
