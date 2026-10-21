const express = require("express");
const router = express.Router();

const {
    addResult,
    getMyResults,
    getResultById
} = require("../controllers/resultController");

const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/allowRoles");

// Add a result (admin only)
router.post(
    "/",
    authHandler,
    allowRoles("admin"),
    addResult
);

// Get results of the logged-in student
router.get(
    "/my-results",
    authHandler,
    allowRoles("student"),
    getMyResults
);

// Get a particular report card
router.get(
    "/:id",
    authHandler,
    getResultById
);

module.exports = router;
