/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
})

const nextConfig = {
  trailingSlash: true,
  images: {
    domains: ['localhost', 'port-san-antonio.vercel.app'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: https:; sandbox;",
    unoptimized: true
  },
  // Removed deprecated experimental options
}

module.exports = withPWA(nextConfig)
