
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = "admin@example.com";
        const password = "Admin123!";
        
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            console.log("This email already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name: "Admin User",
            email: email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin account created successfully!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
