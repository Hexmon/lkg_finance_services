export const serverEnv = {
  AUTH_BASE_URL: process.env.AUTH_BASE_URL || 'https://auth-uat.bhugtan.in',
  ADMIN_BASE_URL: process.env.ADMIN_BASE_URL || 'https://admin-uat.bhugtan.in',
  AUTH_API_KEY: process.env.AUTH_API_KEY || '', // REQUIRED on server for OTP API
};
