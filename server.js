const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const Coupon = require("./models/Coupon");
const adminRoutes = require("./routes/admin");
const guestsession = require("./middleware/guestsession")
const limiter = require("./middleware/limiter")

dotenv.config();
const app = express();
app.use(cors({ 
  origin: "https://coupon-distributor-eta.vercel.app", // Change to your frontend URL
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRoutes);
app.use(guestsession);
app.use("/api/coupon", limiter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));


// API Route to Claim a Coupon
app.get("/api/coupon", async (req, res) => {
    try {
      const userIdentifier = req.guestId || req.ip;
      if(req.guestId){
        console.log("GuestId:",req.guestId);
      }else{
        console.log("IP:",req.ip);
      }
      const cooldownPeriod = 10 * 60 * 1000; // 10 minutes cooldown
  
      // Find the last claimed coupon by this user
      const lastClaim = await Coupon.findOne({ claimedBy: userIdentifier }).sort({ createdAt: -1 });
        console.log("User Identifier:", userIdentifier);
        console.log("Last Claim:", lastClaim);
        if (lastClaim) {
          console.log("Last Claim Time:", lastClaim.createdAt);
          console.log("Time Since Last Claim:", Date.now() - new Date(lastClaim.createdAt).getTime());
        }
      // Check if user is within cooldown period
      if (lastClaim) {
        const timeSinceLastClaim = Date.now() - new Date(lastClaim.createdAt).getTime();
        
        
        if (timeSinceLastClaim < cooldownPeriod) {
          const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastClaim) / 60000);
          return res.status(403).json({ 
            success: false,
            message: `You can claim another coupon after ${remainingTime} minutes.` 
          });
        }
      }
  
      // Find an unclaimed coupon
      const coupon = await Coupon.findOneAndUpdate(
        { claimed: false },
        { claimed: true, claimedBy: userIdentifier, createdAt: new Date() },
        { new: true }
      );
  
      if (!coupon) {
        return res.status(404).json({ 
          success: false, 
          message: "No coupons available at the moment. Try again later!" 
        });
      }
  
      res.json({ 
        success: true, 
        message: "Coupon claimed successfully!", 
        coupon: coupon.code 
      });
  
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: "Server Error. Please try again.", 
        error: err.message 
      });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
