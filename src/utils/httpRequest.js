import axios from "axios";

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
// access token
httpRequest.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// refresh token
let isRefreshing = false;
let tokenListeners = [];
httpRequest.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalConfig = error.config;
    const refreshToken = localStorage.getItem("refreshToken");
    const shouldRenewToken = error.response?.status === 401 && refreshToken;
    if (shouldRenewToken) {
      if (!isRefreshing) {
        isRefreshing = true;
        // isRefreshing để chỉ 1 response lỗi đầu tiên mới refresh
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            {
              refreshToken,
            }
          );
          const data = res.data.data;
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          tokenListeners.forEach((listener) => listener());

          isRefreshing = false;
          tokenListeners = [];
          // tránh việc resfresh những lần sau sẽ bị dùng lại các phần tử cũ

          return httpRequest(originalConfig);
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          // nếu refresh token gửi đi lỗi hay không hợp lệ
          isRefreshing = false;
          tokenListeners = [];
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
      } else {
        // trong khi api đầu tiên refresh, các api lỗi khác sẽ vào đây
        /* return httpRequest(error.config) ở đây sẽ xảy ra đệ quy vì trong thời gian response đầu tiên lấy refresh
          token thì việc gọi httpRequest(error.config) vẫn sẽ gửi token cũ chưa được refresh nên vẫn lỗi và lặp lại
          cho đến khi refresh token thành công*/
        return new Promise((resolve) => {
          tokenListeners.push(() => {
            resolve(httpRequest(originalConfig));
          });
        });
        // cách này sẽ dồn các response khác vào một mảng để gọi sau khi refresh thành công ở trên
      }
    }
    return Promise.reject(error);
  }
);

const request = async (method, url, data, config) => {
  try {
    const isPutOrPatch = ["put", "patch"].includes(method.toLowerCase());
    const effecctiveMethod = isPutOrPatch ? "post" : method;
    const effecctivePath = isPutOrPatch
      ? `${url}${url.includes("?") ? "&" : "?"}_method=${method}`
      : url;
    const res = await httpRequest.request({
      method: effecctiveMethod,
      url: effecctivePath,
      data,
      ...config,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data;
  }
};

export const get = (url, config) => {
  return request("GET", url, null, config);
};

export const post = (url, data, config) => {
  return request("POST", url, data, config);
};

export const put = (url, data, config) => {
  return request("PUT", url, data, config);
};

export const patch = (url, data, config) => {
  return request("PATCH", url, data, config);
};

export const remove = (url, data, config) => {
  return request("DELETE", url, data, config);
};

export default {
  get,
  post,
  put,
  patch,
  remove,
};
