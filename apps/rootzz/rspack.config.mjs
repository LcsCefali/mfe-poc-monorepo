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
      uniqueName: 'mfe-rootzz',
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
        ...Repack.getAssetTransformRules({inline: true}),
      ],
    },
    plugins: [
      new Repack.RepackPlugin(),
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'rootzz',
        filename: 'rootzz.container.js.bundle',
        dts: false,
        exposes: {
          './Button': './src/components/Button/index.tsx',
        },
        shared: {
          react: { 
            singleton: true, 
            eager: true, 
            requiredVersion: false 
          },
          'react-native': { 
            singleton: true, 
            eager: true, 
            requiredVersion: false 
          },
          'react/jsx-runtime': { 
            singleton: true, 
            eager: true,
            requiredVersion: false
          },
        },
      }),
    ],
  };
});