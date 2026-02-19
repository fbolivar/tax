import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // experimental: {
  //   mcpServer: true,
  // },
  serverExternalPackages: ['pdf-parse'],
}

export default nextConfig
