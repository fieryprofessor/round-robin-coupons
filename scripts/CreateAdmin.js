const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const dotenv = require("dotenv");

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/coupons";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const username = "om"; // Change as needed
  const password = "24"; // Change as needed

  const existingAdmin = await Admin.findOne({ username });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();
    console.log("✅ Admin created successfully!");
  } else {
    console.log("⚠️ Admin already exists.");
  }

  mongoose.connection.close();
}).catch(err => console.error(err));
