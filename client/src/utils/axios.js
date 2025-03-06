import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
	baseURL: backendUrl,
});

axiosInstance.interceptors.request.use(
	(response) => response,
	(error) =>
		Promise.reject(
			(error.response && error.response.data) || "Something went wrong"
		)
);

export default axiosInstance;
