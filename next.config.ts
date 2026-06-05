import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const csp = isDev
  ? [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data:`,
      `connect-src 'self' ws: wss:`,
      `object-src 'none';`,
    ].join("; ")
  : [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data:`,
      `connect-src 'none'`,
      `object-src 'none';`,
    ].join("; ");

const nextConfig: NextConfig = {
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
