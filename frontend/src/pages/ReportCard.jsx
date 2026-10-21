
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResultById } from "../api/resultApi";

const isValidReport = (result) => {
    if (
        !result ||
        !result.student ||
        !result.exam ||
        !Array.isArray(result.subjects) ||
        result.subjects.length === 0
    ) {
        return false;
    }

    if (
        typeof result.student.name !== "string" ||
        !result.student.name.trim() ||
        typeof result.student.rollNumber !== "string" ||
        !result.student.rollNumber.trim() ||
        typeof result.exam.name !== "string" ||
        !result.exam.name.trim() ||
        !Number.isInteger(result.exam.semester) ||
        result.exam.semester < 1 ||
        !Number.isFinite(result.totalMarks) ||
        result.totalMarks <= 0 ||
        !Number.isFinite(result.percentage) ||
        result.percentage < 0 ||
        result.percentage > 100 ||
        typeof result.grade !== "string" ||
        !result.grade ||
        !["Pass", "Fail"].includes(result.status)
    ) {
        return false;
    }

    return result.subjects.every((subject) => (
        subject &&
        typeof subject.subjectName === "string" &&
        subject.subjectName.trim() &&
        Number.isFinite(subject.marksObtained) &&
        subject.marksObtained >= 0 &&
        Number.isFinite(subject.maxMarks) &&
        subject.maxMarks > 0 &&
        Number.isFinite(subject.passMarks) &&
        subject.passMarks >= 0 &&
        subject.marksObtained <= subject.maxMarks
    ));
};

function ReportCard() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await getResultById(token, id);

                if (!isValidReport(data)) {
                    throw new Error(
                        "Report card data is incomplete or invalid. Please contact an administrator."
                    );
                }

                setResult(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [id, token]);

    if (loading) {
        return <div className="dashboard">Loading report card...</div>;
    }

    if (error) {
        return (
            <div className="dashboard">
                <h2>Unable to load report card</h2>
                <p>{error}</p>

                <button onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    if (!result) {
        return <div className="dashboard">No report found.</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Student Report Card</h1>

                <button
                    onClick={() => navigate("/student/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="dashboard-card report-card">
                <div className="report-heading">
                    <h2>EXAM RESULT &amp; REPORT CARD</h2>
                    <p>Academic Performance Report</p>
                    <hr />
                </div>

                <h3>{result.exam.name}</h3>

                <div className="student-details">
                    <p>
                        <strong>Student Name:</strong>{" "}
                        {result.student.name}
                    </p>

                    <p>
                        <strong>Roll Number:</strong>{" "}
                        {result.student.rollNumber}
                    </p>

                    <p>
                        <strong>Semester:</strong>{" "}
                        {result.exam.semester}
                    </p>

                    <p>
                        <strong>Report Date:</strong>{" "}
                        {new Date().toLocaleDateString("en-IN")}
                    </p>
                </div>

                <h3>Subject-wise Marks</h3>

                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Obtained</th>
                            <th>Maximum</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {result.subjects.map((subject, index) => {
                            let subjectStatus = "Pass";

                            if (
                                subject.marksObtained <
                                subject.passMarks
                            ) {
                                subjectStatus = "Fail";
                            }

                            return (
                                <tr key={index}>
                                    <td>{subject.subjectName}</td>
                                    <td>{subject.marksObtained}</td>
                                    <td>{subject.maxMarks}</td>
                                    <td>{subjectStatus}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="report-summary">
                    <p>
                        <strong>Total Marks:</strong>{" "}
                        {result.totalMarks}
                    </p>

                    <p>
                        <strong>Percentage:</strong>{" "}
                        {result.percentage.toFixed(2)}%
                    </p>

                    <p>
                        <strong>Grade:</strong> {result.grade}
                    </p>

                    <p>
                        <strong>Final Result:</strong> {result.status}
                    </p>
                </div>

                <button onClick={() => window.print()}>
                    Print Report Card
                </button>
            </div>
        </div>
    );
}

export default ReportCard;
