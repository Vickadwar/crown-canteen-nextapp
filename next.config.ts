import type { NextConfig } from "next";

const FRAPPE_URL =
  process.env.FRAPPE_URL ||
  process.env.NEXT_PUBLIC_FRAPPE_URL ||
  "http://canteen.crownpaints.co.ke";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/erp/:path*",
        destination: `${FRAPPE_URL}/erp/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${FRAPPE_URL}/api/:path*`,
      },
      {
        source: "/desk/:path*",
        destination: `${FRAPPE_URL}/desk/:path*`,
      },
      {
        source: "/app/:path*",
        destination: `${FRAPPE_URL}/app/:path*`,
      },
      {
        source: "/assets/:path*",
        destination: `${FRAPPE_URL}/assets/:path*`,
      },
      {
        source: "/files/:path*",
        destination: `${FRAPPE_URL}/files/:path*`,
      },
    ];
  },
};

export default nextConfig;

