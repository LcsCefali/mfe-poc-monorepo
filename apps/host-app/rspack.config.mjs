import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig(async ({ mode, platform }) => {
  return {
    mode,
    context: __dirname,
    entry: './index.tsx',
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      uniqueName: 'host-app',
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            parallel: true,
            options: {},
          },
          type: 'javascript/auto',
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'host',
        dts: false,
        remotes: {
          rootzz: `rootzz@http://localhost:9000/${platform}/mf-manifest.json`,
        },
        shared: {
          react: { singleton: true, eager: true },
          'react-native': { singleton: true, eager: true },
        },
      }),
    ],
  };
});