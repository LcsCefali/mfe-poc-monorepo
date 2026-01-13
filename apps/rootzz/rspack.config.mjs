import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig(async (env) => {
  const { platform, devServer } = env;

  return {
    context: __dirname,
    entry: './index.tsx',
    output: {
      clean: true,
      path: path.join(__dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].bundle',
      publicPath: devServer ? 'http://localhost:9000/' : Repack.getPublicPath({ platform, devServer }),
    },
    optimization: {
      chunkIds: 'named',
    },
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
        name: 'rootzz',
        filename: 'container.bundle', // Nome limpo e ideal
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