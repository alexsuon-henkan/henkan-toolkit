/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(ico|png|svg|xml)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "favicons/[name].[ext]",
            publicPath: "/_next/static/media/",
            outputPath: "static/media/",
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
