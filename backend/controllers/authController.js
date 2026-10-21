const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req, res) => {
    try {
        // Step 1: Get the required fields from req.body
        const { name, email, password, rollNumber, semester } = req.body;


        // Step 2: Check whether required fields are missing

        if (!name || !email || !password || !rollNumber || !semester) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }


        // Check minimum password length
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }


        const semesterNumber = Number(semester);

        if (
            !Number.isInteger(semesterNumber) ||
            semesterNumber < 1
        ) {
            return res.status(400).json({
                message: "Semester must be a positive integer"
            });
        }


        

        // Step 3: Check whether the email already exists

        // Email ko lowercase karne se pehle type aur format validate karna chahiye:
        if (
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }


        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        // Step 4: Hash the password using bcrypt.hash()

        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 5: Create the user using the User model

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "student",
            rollNumber,
            semester
        });

        // Step 6: Return status 201 with safe user details

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber,
                semester: user.semester
            }
        });


        // Never return the password or password hash


    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};




const login = async (req,res) =>{
    try{

        // 1. Read email and password, Isse incomplete login requests reject hongi.
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }


        // 2. Find the user
        const user = await User.findOne({
            email: email.toLowerCase()
        });

        // Agar user nahi milta, toh generic error return karo:

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 3. Verify the password

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }



        // 4. Generate the JWT token

        const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
        );


        // 5. Return the response : Successful login par HTTP 200 return karo. Response mein token aur safe user details bhejo—password field kabhi nahi.

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }catch(error){
        console.error("Login error:", error);
        return res.status(500).json({
            message : "Server Error"
        });
    }
}





const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "student" })
            .select("name email rollNumber semester")
            .sort({ name: 1 });

        return res.status(200).json(students);
    } catch (error) {
        return res.status(500).json({
            message: "Failed to get students"
        });
    }
};

module.exports = {
    register,
    login,
    getStudents
};


module.exports = { register, login, getStudents };