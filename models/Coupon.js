const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
        type: String,
        required: true,
        unique: true 
    },
  claimed: {
      type: Boolean,
      default: false 
    },
  claimedBy: {
      type: String,
      default: null 
    }, // Stores IP or session ID
  createdAt: {
      type: Date,
      default: Date.now 
    },
});

module.exports = mongoose.model("Coupon", couponSchema);
