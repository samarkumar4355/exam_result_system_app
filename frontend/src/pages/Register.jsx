import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [semester, setSemester] = useState("1");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            await registerUser({
                name,
                email,
                password,
                rollNumber,
                semester: Number(semester)
            });

            setMessage("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Student Registration</h1>

                <p className="subtitle">
                    Create your student account
                </p>

                <form onSubmit={handleRegister}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={6}
                        required
                    />

                    <label>Roll Number</label>
                    <input
                        type="text"
                        placeholder="Enter your roll number"
                        value={rollNumber}
                        onChange={(event) => setRollNumber(event.target.value)}
                        required
                    />

                    <label>Semester</label>
                    <select
                        value={semester}
                        onChange={(event) => setSemester(event.target.value)}
                        required
                    >
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {message && (
                    <p className="message">{message}</p>
                )}

                <p className="register-link">
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
