/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: 'export' to enable API routes for Netlify Functions
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    domains: ['localhost', 'port-san-antonio.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: https:; sandbox;",
    unoptimized: true
  },
  // Removed deprecated experimental options
}

module.exports = nextConfig
