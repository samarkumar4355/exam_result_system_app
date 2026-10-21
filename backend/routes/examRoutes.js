
const express = require("express");
const router = express.Router();

const {
    createExam,
    getExams
} = require("../controllers/examController");

const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/allowRoles");

// Get all exams
router.get(
    "/",
    authHandler,
    getExams
);

// Create a new exam (admin only)
router.post(
    "/",
    authHandler,
    allowRoles("admin"),
    createExam
);

module.exports = router;
