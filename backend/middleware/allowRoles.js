
const allowRoles = (...roles) => {
    return (req, res, next) => {

        // Step 1: Check whether the user is logged in
        if (!req.user) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        // Step 2: Check whether the user has the required role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not allowed to access this route"
            });
        }

        // Step 3: Allow the request to continue
        next();
    };
};

module.exports = allowRoles;
