const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");
const router = express.Router();
const Coupon = require("../models/Coupon");

//Route: Admin Login 
router.post(
  "/login",
  [
    body("username").notEmpty(),
    body("password").notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ success: false, message: "Username doesnt match" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Password Doesnt match" });
      }
      console.log("🔍 Password Match:", isMatch); // Debugging line

      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ success: true, token });
      console.log("Jwt token:",token);

    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

//Route: Viewing all Coupons
router.get("/coupons", auth, async (req, res) => {
    try {
      const coupons = await Coupon.find();
      res.json({ success: true, coupons });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  //Router: Add new Coupons
  router.post("/coupons", auth, async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: "Coupon code is required" });
      }
  
      const newCoupon = new Coupon({ code, claimed: false });
      await newCoupon.save();
  
      res.json({ success: true, message: "Coupon added successfully!" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  //Route: Delete a Coupon
router.delete("/coupons/:id", auth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    await coupon.deleteOne();

    res.json({ success: true, message: "Coupon deleted successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

  // Route: Remove All Coupons
  router.delete("/coupons", auth, async (req, res) => {
    try {
      await Coupon.deleteMany({});
      res.json({ success: true, message: "All coupons have been removed" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Route: Edit Coupon Code by ID
  router.put("/coupons/:id/edit", auth, async (req, res) => {
    try {
      const { code } = req.body;

      // Validate input
      if (!code || code.trim() === "") {
        return res.status(400).json({ success: false, message: "Coupon code cannot be empty" });
      }

      // Find and update coupon
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        { code },
        { new: true } // Return the updated document
      );

      if (!updatedCoupon) {
        return res.status(404).json({ success: false, message: "Coupon not found" });
      }

      res.json({ success: true, message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (err) {
      console.error("Error updating coupon:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  
  //Route: View User Claim History
  router.get("/user-history", auth, async (req, res) => {
    try {
      const history = await Coupon.find({ claimed: true }).select("code claimedBy createdAt");
      res.json({ success: true, history });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  
  //Route: Toggle Coupon Availability
  router.put("/coupons/:id/toggle", auth, async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      if (!coupon) {
        return res.status(404).json({ success: false, message: "Coupon not found" });
      }
  
      coupon.claimed = !coupon.claimed;
      if (!coupon.claimed) {
        coupon.claimedBy = null; // Reset claimedBy when disabling
      }
  
      await coupon.save();
  
      res.json({ success: true, message: `Coupon ${coupon.claimed ? "disabled" : "enabled"}` });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  //Route: Toggle All Coupons Availability
  router.put("/coupons/toggle-all", auth, async (req, res) => {
    try {
      const { enable } = req.body;
      await Coupon.updateMany({}, { claimed: !enable, claimedBy: enable ? null : undefined });
      res.json({ success: true, message: `All coupons ${enable ? "enabled" : "disabled"}` });
    } catch (err) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
  

module.exports = router;
