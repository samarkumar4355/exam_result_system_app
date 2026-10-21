
const API_URL = "http://localhost:5001";

export const getDashboardStats = async (token) => {
    const response = await fetch(`${API_URL}/api/dashboard/stats`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
    }

    return data;
};
