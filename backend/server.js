
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const errorHandler = require("./middleware/errorHandler");

// Step 1: Create the Express application
const app = express();


app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});

// Step 2: Add middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());


app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});

// Step 3: Create a test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Exam Result System API is running"
    });
});

// Step 4: Connect routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);

// Step 5: Add the error handler after routes
app.use(errorHandler);

// Step 6: Set the server port
const PORT = process.env.PORT || 5001;

// Step 7: Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
