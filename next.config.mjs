import { createRequire } from "module"
import { dirname } from "path"

const require = createRequire(import.meta.url)
const nextPkgPath = require.resolve("next/package.json")
// next/package.json lives at <root>/node_modules/next/package.json
// so the project root is 3 levels up from the resolved file
const projectRoot = dirname(dirname(dirname(nextPkgPath)))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
