
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getExams } from "../api/examApi";
import { getStudents, addResult } from "../api/resultApi";

function MarksEntry() {
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    const [exams, setExams] = useState([]);
    const [students, setStudents] = useState([]);

    const [examId, setExamId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [marks, setMarks] = useState([]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const examData = await getExams(token);
                const studentData = await getStudents(token);

                if (Array.isArray(examData)) {
                    setExams(examData);
                } else {
                    setExams(examData.exams || []);
                }

                setStudents(studentData);
            } catch (error) {
                setError(error.message);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const selectedExam = exams.find(
        (exam) => exam._id === examId
    );

    const handleExamChange = (value) => {
        setExamId(value);
        setMarks([]);
        setMessage("");
        setError("");
    };

    const handleMarksChange = (index, value) => {
        const updatedMarks = [...marks];
        updatedMarks[index] = value;
        setMarks(updatedMarks);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!examId || !studentId) {
            setError("Please select an exam and a student.");
            return;
        }

        const subjects = selectedExam.subjects.map(
            (subject, index) => ({
                subjectName: subject.name,
                marksObtained: Number(marks[index])
            })
        );

        try {
            const result = await addResult(token, {
                examId: examId,
                studentId: studentId,
                subjects: subjects
            });

            setMessage(result.message || "Marks saved successfully!");
            setMarks([]);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="dashboard">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Marks Entry</h1>

                <button
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>

            <div className="dashboard-card">
                <form onSubmit={handleSubmit}>
                    <label>Select Exam</label>

                    <select
                        value={examId}
                        onChange={(event) =>
                            handleExamChange(event.target.value)
                        }
                        required
                    >
                        <option value="">Choose an exam</option>

                        {exams.map((exam) => (
                            <option
                                key={exam._id}
                                value={exam._id}
                            >
                                {exam.name} - Semester {exam.semester}
                            </option>
                        ))}
                    </select>

                    <label>Select Student</label>

                    <select
                        value={studentId}
                        onChange={(event) =>
                            setStudentId(event.target.value)
                        }
                        required
                    >
                        <option value="">Choose a student</option>

                        {students.map((student) => (
                            <option
                                key={student._id}
                                value={student._id}
                            >
                                {student.name} - {student.rollNumber}
                            </option>
                        ))}
                    </select>

                    {selectedExam && (
                        <>
                            <h2>Enter Subject Marks</h2>

                            {selectedExam.subjects.map(
                                (subject, index) => (
                                    <div key={subject._id || index}>
                                        <label>
                                            {subject.name}
                                            {" "} (Maximum: {subject.maxMarks})
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max={subject.maxMarks}
                                            value={marks[index] ?? ""}
                                            onChange={(event) =>
                                                handleMarksChange(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                )
                            )}

                            <button type="submit">
                                Save Marks
                            </button>
                        </>
                    )}
                </form>

                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default MarksEntry;
