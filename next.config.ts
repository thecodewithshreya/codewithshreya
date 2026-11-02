import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.38"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // The article page reads MDX sources at runtime to build its table of contents.
  outputFileTracingIncludes: {
    "/blog/[slug]": ["./content/blog/*.mdx"],
  },
};

export default withMDX(nextConfig);
