const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const MEDUSA_BACKEND = MEDUSA_BACKEND_URL
  ? new URL(MEDUSA_BACKEND_URL)
  : null

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  // Explicitly empty: Next's automatic barrel-file optimization otherwise
  // rewrites @headlessui/react's imports into a virtual __barrel_optimize__
  // module that fails to statically resolve named exports (useFocusRing,
  // useHover) re-exported through @react-aria/focus/interactions' Parcel
  // bundled output, breaking `next build`.
  experimental: {
    optimizePackageImports: [],
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Every <Image> uses quality 75 (explicit in the thumbnail, the default
    // elsewhere). Next 16 requires the allowlist; any other value is coerced
    // to the closest entry and a direct /_next/image?q=… request gets a 400.
    qualities: [75],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(MEDUSA_BACKEND
        ? [
            {
              protocol: MEDUSA_BACKEND.protocol.slice(0, -1),
              hostname: MEDUSA_BACKEND.hostname,
              port: MEDUSA_BACKEND.port,
            },
          ]
        : []),
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
