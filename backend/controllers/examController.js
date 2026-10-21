const Exam = require("../models/Exam");

const createExam = async (req, res) => {
  try {
    // Step 1: Get exam details from req.body
    const { name, semester, subjects } = req.body;

    // Step 2: Check whether required fields are provided
    if (!name || !semester || !subjects) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Step 3: Validate semester
    const semesterNumber = Number(semester);

    if (!Number.isInteger(semesterNumber) || semesterNumber < 1) {
      return res.status(400).json({
        message: "Semester must be a positive integer",
      });
    }

    // Step 4: Check whether subjects are valid
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({
        message: "Please provide at least one subject",
      });
    }

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];

      if (
        !subject.name ||
        subject.maxMarks === undefined ||
        subject.passMarks === undefined
      ) {
        return res.status(400).json({
          message: "Please provide valid subject details",
        });
      }

      const maxMarks = Number(subject.maxMarks);
      const passMarks = Number(subject.passMarks);

      if (
        !Number.isFinite(maxMarks) ||
        !Number.isFinite(passMarks) ||
        maxMarks < 1 ||
        passMarks < 0 ||
        passMarks > maxMarks
      ) {
        return res.status(400).json({
          message: "Please provide valid marks for every subject",
        });
      }

      // Store validated numbers for Mongoose
      subject.maxMarks = maxMarks;
      subject.passMarks = passMarks;
    }

    // Step 5: Create the exam
    const exam = await Exam.create({
      name: name.trim(),
      semester: semesterNumber,
      subjects: subjects,
    });

    // Step 6: Send the created exam
    return res.status(201).json({
      message: "Exam created successfully",
      exam: exam,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getExams = async (req, res) => {
  try {
    // Step 1: Get all exams from the database
    const exams = await Exam.find().sort({
      createdAt: -1,
    });

    // Step 2: Return the exam list
    return res.status(200).json({
      totalExams: exams.length,
      exams: exams,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createExam,
  getExams,
};
