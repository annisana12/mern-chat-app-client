export const HOST = import.meta.env.VITE_SERVER_URL;

const AUTH_ROUTES = 'api';
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const REFRESH_TOKEN_ROUTE = `${AUTH_ROUTES}/refresh-token`;