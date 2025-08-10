// Cookie utility functions for handling authentication tokens using react-cookie
import { Cookies } from "react-cookie";

const cookies = new Cookies();

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  return cookies.get(name) || null;
};

/**
 * Set cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options
 */
export const setCookie = (name, value, options = {}) => {
  cookies.set(name, value, {
    path: "/",
    ...options,
  });
};

/**
 * Delete cookie by name
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 */
export const deleteCookie = (name, options = {}) => {
  cookies.remove(name, {
    path: "/",
    ...options,
  });
};

/**
 * Get authentication tokens from cookies
 * @returns {object} - Object containing accessToken and refreshToken
 */
export const getAuthTokensFromCookies = () => {
  // Debug: log all cookies
  console.log("All cookies:", cookies.getAll());

  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  // Debug logging
  console.log("Getting tokens from cookies:", {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    accessTokenLength: accessToken ? accessToken.length : 0,
    refreshTokenLength: refreshToken ? refreshToken.length : 0,
  });

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Clear authentication tokens from cookies
 */
export const clearAuthTokensFromCookies = () => {
  deleteCookie("accessToken", { path: "/" });
  deleteCookie("refreshToken", { path: "/" });

  // Debug logging for development
  console.log("Cleared auth tokens from cookies");
};
