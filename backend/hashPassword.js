// const bcrypt = require("bcryptjs");

// // Replace with the desired plain password
// const plainPassword = "12345678";

// bcrypt.hash(plainPassword, 10, (err, hash) => {
//   if (err) throw err;
//   console.log("Hashed password:", hash);
// });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";  // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    const name = "Nandeesha N M";
    const email = "nandeeshanm04@gmail.com";
    const plainPassword = "12345678";

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists with this email.");
      await mongoose.disconnect();
      return;
    }

    // Create admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${plainPassword}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
};

createAdmin();
