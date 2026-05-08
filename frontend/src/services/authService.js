import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const register = (data) => {
    return axios.post(`${API_URL}/register`, data);
};

export const login = (data) => {
    return axios.post(`${API_URL}/login`, data);
};

export default api;