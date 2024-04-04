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
      // Jika Anda ingin menggunakan remotePatterns untuk Unsplash atau domain lain, tambahkan blok baru di sini
    ],
  },

};


export default nextConfig;
