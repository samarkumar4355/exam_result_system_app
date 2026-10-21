const express = require("express");
const router = express.Router();
const {register, login,  getStudents} = require("../controllers/authController");


const authHandler = require("../middleware/authHandler");
const allowRoles = require("../middleware/allowRoles");


// Student registration
router.post("/register", register);


// User login
router.post("/login", login);


router.get("/students",authHandler, allowRoles("admin"), getStudents);
    
module.exports = router;


    
