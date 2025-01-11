import { useAppStore } from "@/store";
import { HOST, REFRESH_TOKEN_ROUTE } from "@/utils/constants";
import { errorHandler } from "@/utils/error_handler";
import { getNavigate } from "@/utils/navigation";
import axios from "axios";

const apiClient = axios.create({
    withCredentials: true, // Include or store cookies
    baseURL: HOST
});

// Add access token in the request header
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = useAppStore.getState().accessToken;

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Refresh access token when expired
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response.status === 401 &&
            error.response.data.message === "Invalid access token" &&
            !originalRequest._retry // Avoid infinite loop
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(`${HOST}/${REFRESH_TOKEN_ROUTE}`, {}, { withCredentials: true });

                // Set new access token in the state
                useAppStore.getState().setAccessToken(data.accessToken);

                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            } catch {
                const navigate = getNavigate();

                useAppStore.getState().setAccessToken(null);
                useAppStore.getState().setUserInfo(null);

                if (navigate) {
                    navigate('/login');
                }
            }
        }

        return Promise.reject(error);
    }
)

export const apiRequest = async (method, url, data = {}, config = {}, toastDuration = 2000) => {
    let response = null;

    try {
        const reqData = method === 'get' ? { params: data } : { data };

        response = await apiClient.request({
            method,
            url,
            ...reqData,
            ...config
        });
    } catch (error) {
        if (
            error.response &&
            error.response.data.message !== "Invalid access token" &&
            error.response.data.message !== "Invalid refresh token"
        ) {
            errorHandler(error, toastDuration);
        }
    }

    return response;
}