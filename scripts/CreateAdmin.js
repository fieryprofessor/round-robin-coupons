const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected successfully!");

    const username = "om";
    const password = "24";

    console.log("🔍 Checking if admin exists...");
    const existingAdmin = await Admin.findOne({ username });

    if (!existingAdmin) {
      console.log("🔑 Admin not found, creating new admin...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ username, password: hashedPassword });

      await newAdmin.save();
      console.log("✅ Admin created successfully!");
    } else {
      console.log("⚠️ Admin already exists.");
    }

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  })
  .catch(err => console.error("❌ MongoDB error:", err));
