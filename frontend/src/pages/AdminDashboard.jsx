
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/dashboardApi";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalStudents: 0,
        totalExams: 0,
        totalResults: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userData = sessionStorage.getItem("user");
    const user = JSON.parse(userData);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const data = await getDashboardStats(token);

                setStats(data);
            } catch (error) {
                setError(error.message);
            }

            setLoading(false);
        };

        loadDashboard();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        navigate("/login");
    };

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome, {user.name}!</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            {error && (
                <p className="message">{error}</p>
            )}

            <div className="stats-container">
                <div className="dashboard-card">
                    <h2>Total Students</h2>
                    <p className="stat-number">
                        {stats.totalStudents}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h2>Total Exams</h2>
                    <p className="stat-number">
                        {stats.totalExams}
                    </p>
                </div>

                <div className="dashboard-card">
                    <h2>Total Results</h2>
                    <p className="stat-number">
                        {stats.totalResults}
                    </p>
                </div>
            </div>

            <div className="dashboard-card">
                <h2>Manage Exams</h2>
                <p>Create exams and manage their subjects.</p>

                <button onClick={() => navigate("/admin/exams")}>
                    Manage Exams
                </button>
            </div>

            <div className="dashboard-card">
                <h2>Enter Marks</h2>
                <p>Enter marks and generate student results.</p>

                <button onClick={() => navigate("/admin/marks")}>
                    Enter Marks
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;
