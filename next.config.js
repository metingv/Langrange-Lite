// const { i18n } = require('./next-i18next.config')
// const { withSentryConfig } = require('@sentry/nextjs')

// const moduleExports = {
//   i18n,
//   async redirects() {
//     return [
//       {
//         source: '/market',
//         destination: '/',
//         permanent: true,
//       },
//       {
//         source: '/spot/:name',
//         destination: '/',
//         permanent: true,
//       },
//       {
//         source: '/perp/:name',
//         destination: '/',
//         permanent: true,
//       },
//     ]
//   },
//   webpack: (config, { isServer }) => {
//     // Important: return the modified config
//     if (!isServer) {
//       config.resolve.fallback.fs = false
//     }


//     config.module.rules.push({
//       test: /\.svg?$/,
//       oneOf: [
//         {
//           use: [
//             {
//               loader: '@svgr/webpack',
//               options: {
//                 prettier: false,
//                 svgo: true,
//                 svgoConfig: {
//                   plugins: [{ removeViewBox: false }],
//                 },
//                 titleProp: true,
//               },
//             },
//           ],
//           issuer: {
//             and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
//           },
//         },
//       ],
//     })


    
//     return config
//   },
// }

// const sentryWebpackPluginOptions = {
//   // Additional config options for the Sentry Webpack plugin. Keep in mind that
//   // the following options are set automatically, and overriding them is not
//   // recommended:
//   //   release, url, org, project, authToken, configFile, stripPrefix,
//   //   urlPrefix, include, ignore

//   silent: true, // Suppresses all logs
//   // For all available options, see:
//   // https://github.com/getsentry/sentry-webpack-plugin#options.
// }

// // Make sure adding Sentry options is the last code to run before exporting, to
// // ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)








/** @type {import('next').NextConfig} */

const withPlugins = require("next-compose-plugins");

/** eslint-disable @typescript-eslint/no-var-requires */
const withTM = require("next-transpile-modules")([
  // "@solana/wallet-adapter-base",
  // // Uncomment wallets you want to use
  // // "@solana/wallet-adapter-bitpie",
  // // "@solana/wallet-adapter-coin98",
  // // "@solana/wallet-adapter-ledger",
  // // "@solana/wallet-adapter-mathwallet",
  // "@solana/wallet-adapter-phantom",
  // "@solana/wallet-adapter-react",
  // "@solana/wallet-adapter-solflare",
  // "@solana/wallet-adapter-sollet",
  // // "@solana/wallet-adapter-solong",
  // // "@solana/wallet-adapter-torus",
  // "@solana/wallet-adapter-wallets",
  // "@project-serum/sol-wallet-adapter",
  // "@solana/wallet-adapter-ant-design",
]);

// add this if you need LESS
// also install less and less-loader
// const withLess = require("next-with-less");

const plugins = [
  // add this if you need LESS
  // [withLess, {
  //   lessLoaderOptions: {
  //     /* ... */
  //   },
  // }],
  [
    withTM,
    {
      webpack5: true,
      reactStrictMode: true,
      images: {
        domains: ['firebasestorage.googleapis.com', 'avatars.dicebear.com', 'raw.githubusercontent.com', 's2.coinmarketcap.com', 'images.unsplash.com', 'avatars.githubusercontent.com', 'relaxed-newton-b77a1a.netlify.app'],
      },
    },
  ],
];

const nextConfig = {
  swcMinify: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;

    }

    return config;
  },
};

module.exports = withPlugins(plugins, nextConfig);