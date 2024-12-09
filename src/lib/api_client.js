import { HOST } from "@/utils/constants";
import { errorHandler } from "@/utils/error_handler";
import axios from "axios";

const apiClient = axios.create({
    baseURL: HOST
});

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
        errorHandler(error, toastDuration);
    }

    return response;
}