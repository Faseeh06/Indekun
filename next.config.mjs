/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude firebase-admin and Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      }
      // Prevent firebase-admin from being bundled on client
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
      }
    }
    return config
  },
  experimental: {
    // Ensure Firebase Admin is only used server-side
    serverComponentsExternalPackages: ['firebase-admin'],
  },
}

export default nextConfig
