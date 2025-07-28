import httpRequest from "@/utils/httpRequest";

export const me = async () => {
  const res = await httpRequest.get("/auth/me");
  return res;
};

export const login = async (loginInfo) => {
  const res = await httpRequest.post("/auth/login", loginInfo);
  return res;
};

export const logout = async (data) => {
  const res = await httpRequest.post("/auth/logout", data);
  return res;
};

export const register = async (registerInfo, config) => {
  const res = await httpRequest.post("/auth/register", registerInfo, config);
  return res;
};

export const checkInfo = async (type, value) => {
  const res = await httpRequest.get(`auth/check-${type}?${type}=${value}`);
  return res.data.exists;
};

export const resetPassword = async (data, token) => {
  const res = await httpRequest.post(
    `/auth/reset-password?token=${token}`,
    data
  );
  return res;
};

export const verifyResetToken = async (token) => {
  const res = await httpRequest.get(`/auth/verify-reset-token?token=${token}`);
  return res;
};

export const verifyEmailToken = async (token) => {
  const res = await httpRequest.get(`/auth/verify-email?token=${token}`);
  return res;
};

export const sendForgotEmail = async (data) => {
  const res = await httpRequest.post("/auth/forgot-password", data);
  return res;
};

export default {
  me,
  login,
  logout,
  register,
  checkInfo,
};
