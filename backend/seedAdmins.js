import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js"; // make sure path is correct

dotenv.config();

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const admins = [
      { name: "Akash", email: "1akashaakasha290@gmail.com", password: "admin123" },
      { name: "Admin2", email: "admin2@example.com", password: "admin123" },
    ];

    for (let a of admins) {
      const exists = await Admin.findOne({ email: a.email });
      if (!exists) {
        a.password = await bcrypt.hash(a.password, 10);
        await Admin.create(a);
        console.log("Admin created:", a.email);
      } else {
        console.log("Admin already exists:", a.email);
      }
    }

    console.log("✅ Admin seeding completed");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding admins:", err.message);
    mongoose.disconnect();
  }
};

seedAdmins();
