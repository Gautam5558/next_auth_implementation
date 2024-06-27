/** @type {import('next').NextConfig} */

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: !isDevelopment,
};

export default nextConfig;
