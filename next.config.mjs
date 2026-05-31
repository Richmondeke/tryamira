/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,

  // ─── HTTP Cache Headers ──────────────────────────────────────────────────────
  // These headers tell the browser (and CDN/Vercel Edge) how long to cache assets.
  async headers() {
    return [
      // Static assets: fonts, images — cache for 1 year (immutable, content-addressed)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // App icons & favicon — cache for 7 days
      {
        source: '/:file(favicon\\.ico|icon\\.png|apple-icon\\.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      // Public form pages — cache at edge for 60 seconds, stale-while-revalidate for 5 minutes
      // Form data changes infrequently; this eliminates cold-start latency for public visitors
      {
        source: '/f/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      // Dashboard pages — never cache (user-specific, private data)
      {
        source: '/dashboard/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
