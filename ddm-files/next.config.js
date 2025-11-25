function getConfig(config) {
  return config
}

module.exports = getConfig({
  /** We run eslint as a separate task in CI */
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  webpack: (config, { isServer }) => {
    // add copy webpack plugin
    if (isServer) {
      config.plugins.push(
        new (require('copy-webpack-plugin'))({
          patterns: [
            {
              // copy the templates folder
              from: 'data',
              to: 'data/',
            },
          ],
        }),
      )
    }
    return config
  },
})