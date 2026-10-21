
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminExams from "./pages/AdminExams";
import MarksEntry from "./pages/MarksEntry";
import ReportCard from "./pages/ReportCard";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/student/dashboard"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/exams"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminExams />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/admin/marks"
                    element={
                        <ProtectedRoute role="admin">
                            <MarksEntry />
                        </ProtectedRoute>
                    }
                />
                

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />



                <Route
                    path="/student/report/:id"
                    element={
                        <ProtectedRoute role="student">
                            <ReportCard />
                        </ProtectedRoute>
                    }
                />


            </Routes>
        </BrowserRouter>
    );
}

export default App;
