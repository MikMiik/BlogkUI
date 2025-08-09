// Cookie utility functions for handling authentication tokens

/**
 * Get cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Set cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {object} options - Cookie options
 */
export const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Delete cookie by name
 * @param {string} name - Cookie name
 * @param {object} options - Cookie options (path, domain)
 */
export const deleteCookie = (name, options = {}) => {
  setCookie(name, "", {
    ...options,
    expires: new Date(0),
  });
};

/**
 * Get authentication tokens from cookies
 * @returns {object} - Object containing accessToken and refreshToken
 */
export const getAuthTokensFromCookies = () => {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");

  // Debug logging for development
  if (import.meta.env.DEV) {
    console.log("Getting tokens from cookies:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });
  }

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
  if (import.meta.env.DEV) {
    console.log("Cleared auth tokens from cookies");
  }
};
