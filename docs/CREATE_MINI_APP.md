# Criação de um Novo Mini-App

Este guia descreve como criar um novo Mini-App dentro do nosso monorepo utilizando as ferramentas configuradas.

## 1. Utilizando o Script de Criação

Na raiz do projeto, existe um script facilitador que utiliza o CLI do React Native para inicializar a estrutura básica de um novo aplicativo.

Execute o seguinte comando no terminal:

```bash
pnpm create:app <NomeDoApp> <nome-da-pasta>
```

**Exemplo:**
Para criar um app chamado `PaymentApp` na pasta `apps/payment-app`:

```bash
pnpm create:app PaymentApp payment-app
```

> **Nota:** O script automaticamente cria o app dentro da pasta `apps/` com o nome da pasta fornecido.

## 2. Configuração Pós-Criação (MFE Tranformation)

O app criado será um projeto React Native padrão. Para transformá-lo em um Micro Frontend (Mini-App) integrado ao nosso ecossistema, siga os passos abaixo:

### 2.1. Ajustar `package.json`

Abra o `apps/<nome-da-pasta>/package.json` e faça as seguintes alterações:

1.  Mude o nome do pacote se desejar seguir o padrão (ex: `@mfe-poc/payment-app` ou apenas `payment-app`).
2.  Adicione o `mfe-poc-sdk` como dependência de desenvolvimento (workspace).
3.  Configure o `rnx-kit` para alinhamento de dependências.

Exemplo de configuração a adicionar/ajustar:

```json
{
  "scripts": {
    "start": "react-native start --port 9003" // Escolha uma porta livre única
  },
  "devDependencies": {
     // ... outras deps
     "mfe-poc-sdk": "workspace:*",
     "@callstack/repack": "^5.2.3", // Necessário para MFE
     "@rspack/core": "^1.3.4"
  },
  "rnx-kit": {
    "kitType": "app",
    "alignDeps": {
      "presets": [
        "mfe-poc-sdk/preset"
      ],
      "requirements": [
        "mfe-app"
      ],
      "capabilities": [
        "mfe-app"
      ]
    }
  }
}
```

### 2.2. Configurar `rspack.config.mjs`

Em vez de criar o arquivo manualmente, utilize o CLI do Re.Pack para gerar a configuração inicial:

```bash
cd apps/<nome-da-pasta>
pnpm dlx @callstack/repack-init
```

Quando perguntado, selecione a opção **Rspack**.

Isso irá criar o arquivo `rspack.config.mjs` e configurar o `react-native.config.js`. Agora, você precisa editar o `rspack.config.mjs` gerado para adicionar as configurações de Module Federation:

1.  Importe `getSharedDependencies` do SDK.
2.  Defina o `output.uniqueName`.
3.  Adicione o `ModuleFederationPluginV2`.

Exemplo das alterações necessárias:

```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Repack from '@callstack/repack';
import rspack from '@rspack/core';
// 1. Importar helper do SDK
import { getSharedDependencies } from 'mfe-poc-sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default Repack.defineRspackConfig(async ({ mode, platform }) => {
  return {
    mode,
    context: __dirname,
    entry: './index.js',
    resolve: {
      ...Repack.getResolveOptions(platform),
    },
    output: {
      // 2. Definir uniqueName
      uniqueName: 'payment-app',
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
      // 3. Adicionar ModuleFederationPlugin
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'payment', // NOME PARA O HOST REFERENCIAR
        dts: false,
        exposes: {
          './App': './src/App.tsx', // Componente principal a exportar
        },
        shared: getSharedDependencies({ eager: false }), // Eager false para mini-apps
      }),
    ],
  };
});
```

### 2.3. Alinhar Dependências

Após configurar o `rnx-kit` no `package.json`, execute o alinhamento de dependências para garantir que você está usando as versões corretas das bibliotecas (React, React Native, etc) definidas pelo SDK.

```bash
# Na raiz do monorepo
pnpm rnx-align-deps apps/<nome-da-pasta> --write
```
Ou se você adicionar o script no package.json do seu app.

## 3. Registrar no Host App

Para que o Host App consiga carregar seu novo mini-app:

1.  Abra `apps/host-app/rspack.config.mjs`.
2.  Adicione a entrada no objeto `remotes` do `ModuleFederationPlugin`:

```javascript
remotes: {
  // ...
  payment: `payment@http://localhost:9003/${platform}/mf-manifest.json`,
},
```
(Certifique-se de usar a mesma porta definida no script `start` do seu mini-app).

## 4. Usar no Host App

Simplesmente importe o componente federado no código do Host App:

```tsx
const PaymentApp = React.lazy(() => import('payment/App'));

// Uso
<React.Suspense fallback={<Text>Loading...</Text>}>
  <PaymentApp />
</React.Suspense>
```
