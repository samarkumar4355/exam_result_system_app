
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (!token || !userData) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    let user;

    try {
        user = JSON.parse(userData);
    } catch {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        return <Navigate to="/login" replace />;
    }

    if (!user || !["admin", "student"].includes(user.role)) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        const destination =
            user.role === "admin" ? "/admin/dashboard" : "/student/dashboard";
        return <Navigate to={destination} replace />;
    }

    return children;
}

export default ProtectedRoute;
