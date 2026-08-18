/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

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
      // Widget.js — CORS enabled for cross-origin embedding + cache 1 hour
      {
        source: '/widget.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=600' },
        ],
      },
      // Public API v1 — CORS enabled for api.heyamira.com cross-origin calls
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' },
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
