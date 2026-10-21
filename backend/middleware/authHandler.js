
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authHandler = async (req, res, next) => {
    try {
        // Step 1: Get the token from the request header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        // Step 2: Verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Step 3: Find the user in the database
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Step 4: Store user details in req.user
        req.user = user;

        // Step 5: Move to the next middleware or controller
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please login again"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        return res.status(500).json({
            message: "Authentication failed"
        });
    }
};

module.exports = authHandler;
