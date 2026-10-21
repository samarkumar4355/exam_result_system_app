const mongoose = require("mongoose");

const subjectResultSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    marksObtained: {
        type: Number,
        required: true,
        min: 0
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

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },

    subjects: {
        type: [subjectResultSchema],
        required: true,
        validate: {
            validator: function (subjects) {
                return subjects.length > 0;
            },
            message: "At least one subject is required"
        }
    },

    totalMarks: {
        type: Number,
        required: true,
        min: 1
    },

    percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    grade: {
        type: String,
        required: true,
        enum: ["A+", "A", "B", "C", "D", "F"]
    },

    status: {
        type: String,
        required: true,
        enum: ["Pass", "Fail"]
    }

}, {
    timestamps: true
});

// Prevent duplicate results for the same student and exam
resultSchema.index(
    { student: 1, exam: 1 },
    { unique: true }
);

module.exports = mongoose.model("Result", resultSchema);
