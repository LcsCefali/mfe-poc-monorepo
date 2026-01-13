import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig(async (env) => {
  const { platform, devServer } = env;

  return {
    context: __dirname,
    mode: devServer ? 'development' : 'production',
    devtool: 'source-map',
    entry: './index.tsx',
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    module: {
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          type: 'javascript/auto',
          use: {
            loader: '@callstack/repack/babel-swc-loader',
            options: {
              platform,
              devServer,
            },
          },
        },
        ...Repack.getAssetTransformRules(),
      ],
    },
    plugins: [
      new Repack.RepackPlugin({
        platform,
        devServer,
      }),
      new Repack.plugins.ModuleFederationPlugin({
        name: 'host',
        remotes: {
          // Alterado de remoteEntry.bundle para container.bundle
          rootzz: `rootzz@http://localhost:9000/container.bundle`,
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