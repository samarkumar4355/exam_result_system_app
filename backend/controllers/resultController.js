const Result = require("../models/Result");
const User = require("../models/User");
const Exam = require("../models/Exam");

const addResult = async (req, res) => {
    try {
        const { studentId, examId, subjects } = req.body;

        // Step 1: Check required fields
        if (!studentId || !examId || !Array.isArray(subjects)) {
            return res.status(400).json({
                message: "Please provide student, exam and subject marks"
            });
        }

        if (subjects.length === 0) {
            return res.status(400).json({
                message: "Please provide subject marks"
            });
        }

        // Step 2: Find the student
        const student = await User.findById(studentId);

        if (!student || student.role !== "student") {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Step 3: Find the exam
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({
                message: "Exam not found"
            });
        }

        if (student.semester !== exam.semester) {
            return res.status(400).json({
                message: "Student and exam semesters do not match"
            });
        }

        if (exam.isPublished) {
            return res.status(400).json({
                message: "Published exam results cannot be changed"
            });
        }

        if (!Array.isArray(exam.subjects) || exam.subjects.length === 0) {
            return res.status(400).json({
                message: "This exam has no subjects configured"
            });
        }

        // Step 4: Check for an existing result
        const existingResult = await Result.findOne({
            student: studentId,
            exam: examId
        });

        if (existingResult) {
            return res.status(409).json({
                message: "Result already exists for this student"
            });
        }

        // Step 5: Check subject count
        if (subjects.length !== exam.subjects.length) {
            return res.status(400).json({
                message: "Please provide marks for every exam subject exactly once"
            });
        }

        // Step 6: Validate submitted subjects
        for (let i = 0; i < subjects.length; i++) {
            if (
                !subjects[i] ||
                typeof subjects[i].subjectName !== "string" ||
                subjects[i].subjectName.trim() === "" ||
                subjects[i].marksObtained === "" ||
                subjects[i].marksObtained === null ||
                subjects[i].marksObtained === undefined ||
                !Number.isFinite(Number(subjects[i].marksObtained))
            ) {
                return res.status(400).json({
                    message: "Invalid subject name or marks"
                });
            }

            // Reject duplicate subject names
            for (let j = i + 1; j < subjects.length; j++) {
                if (
                    subjects[i].subjectName.trim() ===
                    subjects[j].subjectName.trim()
                ) {
                    return res.status(400).json({
                        message: "Duplicate subjects are not allowed"
                    });
                }
            }
        }

        // Step 7: Calculate marks
        let totalMarks = 0;
        let obtainedMarks = 0;
        let isPassed = true;

        const subjectResults = [];

        for (let i = 0; i < exam.subjects.length; i++) {
            const examSubject = exam.subjects[i];
            let marksFound = false;
            let marksObtained = 0;

            for (let j = 0; j < subjects.length; j++) {
                if (
                    subjects[j].subjectName.trim() === examSubject.name
                ) {
                    marksFound = true;
                    marksObtained = Number(subjects[j].marksObtained);
                    break;
                }
            }

            if (!marksFound) {
                return res.status(400).json({
                    message: "Marks are missing for " + examSubject.name
                });
            }

            if (
                !Number.isFinite(examSubject.maxMarks) ||
                examSubject.maxMarks <= 0 ||
                !Number.isFinite(examSubject.passMarks) ||
                examSubject.passMarks < 0 ||
                examSubject.passMarks > examSubject.maxMarks
            ) {
                return res.status(400).json({
                    message: "Invalid marks configuration for " + examSubject.name
                });
            }

            if (
                marksObtained < 0 ||
                marksObtained > examSubject.maxMarks
            ) {
                return res.status(400).json({
                    message: "Invalid marks for " + examSubject.name
                });
            }

            totalMarks += examSubject.maxMarks;
            obtainedMarks += marksObtained;

            if (marksObtained < examSubject.passMarks) {
                isPassed = false;
            }

            subjectResults.push({
                subjectName: examSubject.name,
                marksObtained: marksObtained,
                maxMarks: examSubject.maxMarks,
                passMarks: examSubject.passMarks
            });
        }

        if (totalMarks <= 0) {
            return res.status(400).json({
                message: "Total maximum marks must be greater than zero"
            });
        }

        // Step 8: Calculate percentage
        const percentage = (obtainedMarks / totalMarks) * 100;

        // Step 9: Calculate grade
        let grade;

        if (percentage >= 90) {
            grade = "A+";
        } else if (percentage >= 80) {
            grade = "A";
        } else if (percentage >= 70) {
            grade = "B";
        } else if (percentage >= 60) {
            grade = "C";
        } else if (percentage >= 40) {
            grade = "D";
        } else {
            grade = "F";
        }

        // Step 10: Calculate final status
        let status = "Fail";

        if (isPassed) {
            status = "Pass";
        }

        // Step 11: Save result
        const result = await Result.create({
            student: studentId,
            exam: examId,
            subjects: subjectResults,
            totalMarks: totalMarks,
            percentage: percentage,
            grade: grade,
            status: status
        });

        return res.status(201).json({
            message: "Result added successfully",
            result: result
        });

    }catch (error) {
    // Duplicate result: one student can have only one result per exam
    if (error.code === 11000) {
        return res.status(409).json({
            message: "Result already exists for this student and exam"
        });
    }

    if (error.name === "CastError") {
        return res.status(400).json({
            message: "Invalid student ID or exam ID"
        });
    }

    console.error("Add result error:", error);

    return res.status(500).json({
        message: "Server error"
    });
}
};


const getMyResults = async (req, res) => {
    try {
        const results = await Result.find({
            student: req.user._id
        })
            .populate("exam", "name semester")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            totalResults: results.length,
            results: results
        });

    } catch (error) {
        console.error("Get my results error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


const getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate("student", "name email rollNumber semester")
            .populate("exam", "name semester");

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        if (!result.student || !result.exam) {
            return res.status(404).json({
                message: "Report card data is unavailable"
            });
        }

        // Students can only see their own results
        if (
            req.user.role === "student" &&
            result.student._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You are not allowed to view this result"
            });
        }

        return res.status(200).json({
            result: result
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid result ID"
            });
        }

        console.error("Get result error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addResult,
    getMyResults,
    getResultById
};