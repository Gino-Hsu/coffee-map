import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  experimental: {},
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
