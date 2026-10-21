const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ["admin", "student"]
    },

    rollNumber: {
        type: String,
        required: function () {
            return this.role === "student";
        },
        unique: true,
        sparse: true
    },

    semester: {
        type: Number,
        required: function () {
            return this.role === "student";
        },
        min: 1
   }
});


module.exports = mongoose.model("User", userSchema);