/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // https://docs.pmnd.rs/react-three-fiber/getting-started/installation#next.js
  transpilePackages: ["three"],
}

const shouldAnalyzeBundles = process.env.ANALYZE === true;

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer =
    require('next-bundle-analyzer')(/* options come there */);
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig