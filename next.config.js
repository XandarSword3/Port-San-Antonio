/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'port-san-antonio.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: https:; sandbox;",
  },
  // Removed deprecated experimental options
}

module.exports = nextConfig
