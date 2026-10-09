/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node": false,
      "onnxruntime-node$": false,
      "module": false,
    };
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        crypto: false,
        os: false,
        path: false,
        module: false,
      };
    }
    // Fix for import.meta in ort-wasm-simd-threaded.jsep.wasm / min.mjs
    config.module.rules.push({
      test: /\.m?js$/,
      include: /[\\/]node_modules[\\/](onnxruntime-web|@imgly)[\\/]/,
      type: "javascript/auto",
    });

    return config;
  },
};

export default nextConfig;
