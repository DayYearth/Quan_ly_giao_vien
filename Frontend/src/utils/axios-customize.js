import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

// Tạo một instance của axios
const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: false, // Không sử dụng cookie hoặc thông tin xác thực
});

const NO_RETRY_HEADER = 'x-no-retry';

// Thêm request interceptor
instance.interceptors.request.use(
    (config) => {
        // Kiểm tra nếu URL không nằm trong danh sách noAuthApis thì thêm header Authorization
            if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
                config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
            }
            if (!config.headers.Accept && config.headers["Content-Type"]) {
                config.headers.Accept = "application/json";
                config.headers["Content-Type"] = "application/json; charset=utf-8";
            }
        return config; 
    },
    (error) => {
        return Promise.reject(error); // Trả về lỗi nếu có vấn đề trong config
    }
);

// Thêm response interceptor
instance.interceptors.response.use(
    (response) => {
        // Trả về dữ liệu từ response (giữ nguyên không thay đổi)
        return response;
    },
    (error) => {
        // Xử lý lỗi nếu có
        return Promise.reject(error); // Trả về lỗi
    }
);

export default instance;