
const errorHandler = (err, req, res, next) => {

    // Step 1: Set the status code
    let statusCode = 500;

    // Check whether a status code is already set
    if (res.statusCode && res.statusCode !== 200) {
        statusCode = res.statusCode;
    } else {
        statusCode = 500;
    }
    
    // Step 2: Return the error response
    return res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;
