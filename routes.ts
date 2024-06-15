// these are public rotes, anyone can acces them

export const publicRoutes = ["/"];

// Routes that are used by nextjs to facilitate auth like /api/auth/...
// So these routes are hit by nextjs for auth to work , hence they are made public
// These routes start with with foloowing prefix

export const apiAuthPrefix = "/api/auth";

// Array of routes used for auth like login, register
// If a user is logged in and tries to access them, they will be redirected to /settings route
// And it used isnt logged in and tries to access the "/settings" route which is protected,
// they will get redirected to login route

export const authRoutes = ["/auth/login", "/auth/register"];

// When a person logs in we will redirect them to "/settings route"

export const DEFAULT_LOGIN_REDIRECT = "/settings";
