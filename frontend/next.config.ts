import type { NextConfig } from "next";

// Parse the backend URL from env to dynamically set allowed image hostnames
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const parsedApiUrl = new URL(apiUrl);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: parsedApiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: parsedApiUrl.hostname,
        port: parsedApiUrl.port || "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
