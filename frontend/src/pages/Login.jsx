import { useState } from "react";
import { loginUser } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const data = await loginUser(email, password);

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }
        } catch (error) {
            setMessage(error.message);
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Exam Result System</h1>

                <p className="subtitle">
                    Login to access your account
                </p>

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <p className="message">{message}</p>
                )}

                <p className="register-link">
                    Don't have a student account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
