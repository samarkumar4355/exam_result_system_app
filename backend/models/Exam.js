const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    maxMarks: {
        type: Number,
        required: true,
        min: 1
    },
    passMarks: {
        type: Number,
        required: true,
        min: 0
    }
});

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1
    },
    subjects: {
        type: [subjectSchema],
        required: true,
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: "An exam must have at least one subject."
        }
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Exam", examSchema);
