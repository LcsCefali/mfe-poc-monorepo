import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';

import { getSharedDependencies } from 'mfe-poc-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rspack configuration enhanced with Re.Pack defaults for React Native.
 *
 * Learn about Rspack configuration: https://rspack.dev/config/
 * Learn about Re.Pack configuration: https://re-pack.dev/docs/guides/configuration
 */

export default Repack.defineRspackConfig(async ({ mode, platform }) => {
  return {
    mode,
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      uniqueName: 'checkout-app',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          type: 'javascript/auto',
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
        new Repack.RepackPlugin(),
        new Repack.plugins.ModuleFederationPluginV2({
          name: 'checkout',
          filename: 'checkout.container.js.bundle',
          dts: false,
          exposes: {
            // './App': './src/App',
            './App': './App',
          },
          shared: getSharedDependencies({ eager: false })
        }),
      ],
  }
});
