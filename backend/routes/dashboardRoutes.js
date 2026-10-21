
const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/allowRoles");

// Admin dashboard statistics
router.get( "/stats",authHandler, allowRoles("admin"), getDashboardStats);
   
    
module.exports = router;
