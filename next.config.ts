import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/contacto", destination: "/consulta", permanent: true },
      { source: "/empresas", destination: "https://hebaro-llc.base44.app/", permanent: true },
    ];
  },
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
