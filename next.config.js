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
  output: 'export', // Required for GitHub Pages static deployment
  trailingSlash: true, // Helps with GitHub Pages routing
  images: {
    domains: ['localhost', 'port-san-antonio.vercel.app', 'xandarsword3.github.io'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; img-src 'self' data: https:; sandbox;",
    unoptimized: true // Required for static export
  },
  // GitHub Pages deployment specific settings
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/Port-San-Antonio' : '',
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES ? '/Port-San-Antonio/' : '',
}

module.exports = withPWA(nextConfig)
