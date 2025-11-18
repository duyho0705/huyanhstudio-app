import axios from "axios";

// instance chính dùng cho hầu hết request
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// instance riêng để gọi refresh token (không gắn interceptor để tránh vòng lặp)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// avoid multiple refresh calls at same time
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}
function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Request interceptor: attach token if exists and not to auth endpoints (optional)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    // if url is full (absolute) keep it; else join with baseURL
    const isAuthApi =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh");

    if (token && !isAuthApi) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: trả về response.data, xử lý refresh token
axiosClient.interceptors.response.use(
  (response) => {
    // nhiều backend trả data trực tiếp trong body, nên trả về response.data cho tầng dùng
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // nếu response rỗng hoặc đã retry thì reject
    if (!error.response) return Promise.reject(error);

    // 401 -> try refresh token (chỉ với những request không phải /auth/refresh)
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // Không có refresh -> clear và redirect (hoặc let caller xử lý)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // optionally trigger global logout event (AuthContext nên lắng nghe)
        window.location.href = "/";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // nếu đang refresh thì chờ đến khi có token mới rồi retry
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (!token) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const resp = await refreshClient.post("/auth/refresh", {
          refreshToken,
        });
        // resp có thể trả dữ liệu khác nhau; nếu axiosClient trả response.data, resp chính là response object (vì refreshClient không có interceptor trả data)
        const data = resp.data || resp; // bảo thủ
        const newAccessToken = data.accessToken;
        // lưu token mới
        localStorage.setItem("accessToken", newAccessToken);
        // cập nhật header cho các request chờ
        onRefreshed(newAccessToken);
        // retry original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (err) {
        // refresh thất bại -> clear và redirect / reject
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        onRefreshed(null);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // other errors
    return Promise.reject(error);
  }
);

export default axiosClient;
export { refreshClient };
