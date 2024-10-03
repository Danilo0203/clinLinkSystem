/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    env: {
        NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST
    },
    experimental: {
        missingSuspenseWithCSRBailout: false
    }
};
