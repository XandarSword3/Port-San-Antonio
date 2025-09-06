/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Netlify deployment with API routes
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: {
    domains: ['localhost', 'port-san-antonio.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: https:; sandbox;",
    unoptimized: true
  }
}

module.exports = nextConfig
