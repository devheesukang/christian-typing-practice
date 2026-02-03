const isElectronBuild = process.env.ELECTRON_BUILD === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix: isElectronBuild ? "./" : undefined,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
