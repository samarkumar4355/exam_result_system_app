
const API_URL = "http://localhost:5001";

export const getExams = async (token) => {
    const response = await fetch(`${API_URL}/api/exams`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load exams");
    }

    return data;
};

export const createExam = async (token, examData) => {
    const response = await fetch(`${API_URL}/api/exams`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(examData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create exam");
    }

    return data;
};
