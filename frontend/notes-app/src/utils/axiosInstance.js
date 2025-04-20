import axios from "axios";
import { BASE_URL } from "./constants.js";

const axiotInstance = axios.create({
    baseURL: BASE_URL,
    Timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
    },
});

axiotInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiotInstance;