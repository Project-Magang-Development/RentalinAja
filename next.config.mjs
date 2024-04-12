/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ["assets.example.com", "unsplash.com", "yourstorage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
        pathname: "/account123/**",
      },
    ],
  },

};


export default nextConfig;
