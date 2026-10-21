
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExams, createExam } from "../api/examApi";

function AdminExams() {
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [name, setName] = useState("");
    const [semester, setSemester] = useState("1");

    const [subjects, setSubjects] = useState([
        { name: "", maxMarks: "100", passMarks: "40" }
    ]);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = sessionStorage.getItem("token");

    const loadExams = async () => {
        try {
            const data = await getExams(token);

            if (Array.isArray(data)) {
                setExams(data);
            } else {
                setExams(data.exams || []);
            }
        } catch (error) {
            setError(error.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadExams();
    }, []);

    const addSubject = () => {
        setSubjects([
            ...subjects,
            { name: "", maxMarks: "100", passMarks: "40" }
        ]);
    };

    const updateSubject = (index, field, value) => {
        const updatedSubjects = [...subjects];

        updatedSubjects[index][field] = value;

        setSubjects(updatedSubjects);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const examData = {
            name: name,
            semester: Number(semester),
            subjects: subjects.map((subject) => ({
                name: subject.name.trim(),
                maxMarks: Number(subject.maxMarks),
                passMarks: Number(subject.passMarks)
            }))
        };

        try {
            await createExam(token, examData);

            setMessage("Exam created successfully!");
            setName("");
            setSemester("1");
            setSubjects([
                { name: "", maxMarks: "100", passMarks: "40" }
            ]);

            await loadExams();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Manage Exams</h1>
                    <p>Create and view exams.</p>
                </div>

                <button onClick={() => navigate("/admin/dashboard")}>
                    Back to Dashboard
                </button>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="dashboard-card">
                <h2>Create New Exam</h2>

                <form onSubmit={handleSubmit}>
                    <label>Exam Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Example: Mid Semester Exam"
                        required
                    />

                    <label>Semester</label>
                    <input
                        type="number"
                        min="1"
                        value={semester}
                        onChange={(event) => setSemester(event.target.value)}
                        required
                    />

                    <h3>Subjects</h3>

                    {subjects.map((subject, index) => (
                        <div key={index} className="dashboard-card">
                            <h4>Subject {index + 1}</h4>

                            <label>Subject Name</label>
                            <input
                                type="text"
                                value={subject.name}
                                onChange={(event) =>
                                    updateSubject(index, "name", event.target.value)
                                }
                                placeholder="Example: Mathematics"
                                required
                            />

                            <label>Maximum Marks</label>
                            <input
                                type="number"
                                min="1"
                                value={subject.maxMarks}
                                onChange={(event) =>
                                    updateSubject(index, "maxMarks", event.target.value)
                                }
                                required
                            />

                            <label>Passing Marks</label>
                            <input
                                type="number"
                                min="0"
                                value={subject.passMarks}
                                onChange={(event) =>
                                    updateSubject(index, "passMarks", event.target.value)
                                }
                                required
                            />
                        </div>
                    ))}

                    <button type="button" onClick={addSubject}>
                        Add Another Subject
                    </button>

                    <button type="submit">
                        Create Exam
                    </button>
                </form>

                {message && <p>{message}</p>}
                {error && <p>{error}</p>}
            </div>

            <div className="dashboard-card">
                <h2>Existing Exams</h2>

                {loading && <p>Loading exams...</p>}

                {!loading && exams.length === 0 && (
                    <p>No exams found. Create your first exam above.</p>
                )}

                {exams.map((exam) => (
                    <div key={exam._id} className="dashboard-card">
                        <h3>{exam.name}</h3>
                        <p>Semester: {exam.semester}</p>
                        <p>Subjects: {exam.subjects.length}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminExams;
