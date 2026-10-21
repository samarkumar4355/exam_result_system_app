
const API_URL = "http://localhost:5001";

export const getStudents = async (token) => {
    const response = await fetch(`${API_URL}/api/auth/students`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load students");
    }

    return data;
};

export const addResult = async (token, resultData) => {
    const response = await fetch(`${API_URL}/api/results`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(resultData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to save marks");
    }

    return data;
};



export const getMyResults = async (token) => {
    const response = await fetch(
        `${API_URL}/api/results/my-results`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load results");
    }

    return data;
};


export const getResultById = async (token, resultId) => {
    const response = await fetch(
        `${API_URL}/api/results/${resultId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load report card");
    }

    if (
        !data ||
        !data.result ||
        typeof data.result !== "object" ||
        Array.isArray(data.result)
    ) {
        throw new Error("Unexpected report card response from server");
    }

    return data.result;
};
