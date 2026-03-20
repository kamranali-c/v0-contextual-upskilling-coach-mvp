import { createRequire } from "module"
import { dirname, join } from "path"

const require = createRequire(import.meta.url)
const nextPkgDir = dirname(require.resolve("next/package.json"))
const projectRoot = join(nextPkgDir, "../..")

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
