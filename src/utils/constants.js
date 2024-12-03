export const HOST = import.meta.env.VITE_SERVER_URL;

const USER_ROUTES = 'api/user';
export const SIGNUP_ROUTE = `${USER_ROUTES}/register`;
export const LOGIN_ROUTE = `${USER_ROUTES}/login`;