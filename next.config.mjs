import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { realpathSync } from "fs"

const __dirname = realpathSync(dirname(fileURLToPath(import.meta.url)))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
