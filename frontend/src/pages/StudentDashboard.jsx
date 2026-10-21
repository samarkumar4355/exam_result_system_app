
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResults } from "../api/resultApi";

function StudentDashboard() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : {};
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const loadResults = async () => {
            try {
                const data = await getMyResults(token);

                if (Array.isArray(data)) {
                    setResults(data);
                } else if (data && Array.isArray(data.results)) {
                    setResults(data.results);
                } else {
                    setResults([]);
                    setError(
                        data && data.message
                            ? data.message
                            : "Unexpected response from server."
                    );
                }
            } catch (error) {
                setError(error.message);
            }

            setLoading(false);
        };

        loadResults();

    }, [token]);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome, {user.name || "Student"}!</p>
                    <p>{user.email}</p>
                </div>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="dashboard-card">
                <h2>My Results</h2>

                {loading && <p>Loading results...</p>}

                {error && <p>{error}</p>}

                {!loading && !error && results.length === 0 && (
                    <p>No results are available yet.</p>
                )}

                {!loading && results.map((result) => (
                    <div
                        key={result._id}
                        className="dashboard-card"
                    >
                        <h3>
                            {result.exam
                                ? result.exam.name
                                : "Exam"}
                        </h3>

                        <p>
                            Semester:{" "}
                            {result.exam
                                ? result.exam.semester
                                : "N/A"}
                        </p>

                        <p>Total Marks: {result.totalMarks}</p>

                        <p>
                            Percentage:{" "}
                            {Number.isFinite(result.percentage)
                                ? `${result.percentage.toFixed(2)}%`
                                : "Unavailable"}
                        </p>

                        <p>Grade: {result.grade}</p>
                        <p>Status: {result.status}</p>

                        <button
                            onClick={() =>
                                navigate(`/student/report/${result._id}`)
                            }
                        >
                            View Report Card
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentDashboard;
