
const User = require("../models/User");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

const getDashboardStats = async (req, res) => {
    try {
        // Step 1: Count all students
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        // Step 2: Count all exams
        const totalExams = await Exam.countDocuments();

        // Step 3: Count all results
        const totalResults = await Result.countDocuments();

        // Step 4: Send dashboard statistics
        return res.status(200).json({
            totalStudents: totalStudents,
            totalExams: totalExams,
            totalResults: totalResults
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { getDashboardStats };
