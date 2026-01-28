# Criação de um Novo Mini-App

Este guia descreve como criar um novo Mini-App dentro do nosso monorepo utilizando as ferramentas configuradas.

## 1. Utilizando o Script de Criação

Na raiz do projeto, existe um script facilitador que utiliza o CLI do React Native para inicializar a estrutura básica de um novo aplicativo.

Execute o seguinte comando no terminal:

```bash
pnpm create:app <NomeDoApp> <nome-da-pasta>
```

**Exemplo:**
Para criar um app chamado `CheckoutApp` na pasta `apps/checkout-app`:

```bash
pnpm create:app CheckoutApp checkout-app
```

> **Nota:** O script automaticamente cria o app dentro da pasta `apps/` com o nome da pasta fornecido.

## 2. Configuração Pós-Criação (MFE Tranformation)

O app criado será um projeto React Native padrão. Para transformá-lo em um Micro Frontend (Mini-App) integrado ao nosso ecossistema, siga os passos abaixo:

### 2.1. Ajustar `package.json`

Abra o `apps/<nome-da-pasta>/package.json` e faça as seguintes alterações:

1.  **Renomeie o pacote:** O CLI do React Native cria o `package.json` com o nome da classe (ex: `CheckoutApp`). Para o correto funcionamento do PNPM Workspace e consistência, renomeie para kebab-case (ex: `checkout-app` ou `@mfe-poc/checkout-app`).
2.  Adicione o `mfe-poc-sdk` como dependência de desenvolvimento (workspace).
3.  Configure o `rnx-kit` para alinhamento de dependências.

Exemplo de configuração a adicionar/ajustar:

```json
{
  "scripts": {
    "start": "react-native start --port 9002" // Escolha uma porta livre única
  },
  "devDependencies": {
     // ... outras deps
     "mfe-poc-sdk": "workspace:*",
  },
  "rnx-kit": {
    "kitType": "app",
    "alignDeps": {
      "presets": [
        "mfe-poc-sdk/preset"
      ],
      "requirements": [
        "react-native@0.83.1"
      ],
      "capabilities": [
        "mfe-app"
      ]
    }
  }
}
```

### 2.2 Limpeza de Dependências de Linting

O `react-native init` instala configurações padrão de ESLint e Prettier locais que entram em conflito com o padrão do monorepo.

**Remova** as seguintes entradas do `package.json` do seu novo app:

```json
/* Exclua essas linhas do devDependencies se existirem */
"eslint": "...",
"prettier": "...",
"@react-native/eslint-config": "...",
"@react-native-community/eslint-config": "...",
"eslint-config-prettier": "...",
"eslint-plugin-prettier": "..."
```

**Garanta** que o `eslint.config.js` na raiz do seu novo app tenha o seguinte conteúdo para herdar as regras da Eduzz:

```javascript
/* apps/<seu-app>/eslint.config.js */
const { ignores, configs } = require('@eduzz/eslint-config/react-native');

/** @type import('eslint').Linter.Config[] */
module.exports = [...configs, { ignores: [...ignores(), 'rspack.config.mjs'] }];
```

**Configure** o `.prettierrc.js` na raiz do seu novo app para usar as configurações compartilhadas:

```javascript
/* apps/<seu-app>/.prettierrc.js */
module.exports = {
  ...require('@eduzz/eslint-config/.prettierrc')
};
```

> **Nota:** Se houver arquivos de configuração antigos como `.eslintrc.js` ou `.prettierrc` (JSON), apague-os.

### 2.3. Adicionar Scripts Padrão

Para garantir a integração com os comandos da raiz do monorepo, atualize a seção `scripts` do `package.json` do seu app com os seguintes comandos padrão (ajuste a porta do `start` conforme necessário):

```json
"scripts": {
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "start": "react-native start --port <ESCOLHA_UMA_PORTA_UNICA>",
  "test": "jest",
  "lint": "eslint .",
  "typecheck": "tsc",
  "bundle:ios": "react-native bundle --platform ios --entry-file index.js --dev false",
  "bundle:android": "react-native bundle --platform android --entry-file index.js --dev false",
  "pods": "(cd ios && bundle install && bundle exec pod install)",
  "pods:update": "(cd ios && bundle exec pod update)",
  "align-deps": "rnx-align-deps --write",
  "check-deps": "rnx-align-deps"
},
```

### 2.4. Executar Alinhamento de Dependências

Após ajustar o `package.json` removendo as libs conflitantes e adicionando/configurando o SDK, execute o script de alinhamento na raiz do monorepo. Isso irá instalar as versões corretas das dependências (incluindo o ESLint correto via preset).

```bash
# Na raiz do monorepo
pnpm --filter <nome-do-pacote-no-package-json> align-deps
pnpm install
```

### 2.5. Configurar `rspack.config.mjs`

Em vez de criar o arquivo manualmente, utilize o CLI do Re.Pack para gerar a configuração inicial. Criamos um script helper para isso:

```bash
# Sintaxe: pnpm prepare:repack <nome-da-pasta-do-app>
pnpm prepare:repack checkout-app
```

Quando perguntado, selecione a opção **Rspack**.

Isso irá criar o arquivo `rspack.config.mjs` e configurar o `react-native.config.js`. Agora, você precisa editar o `rspack.config.mjs` gerado para adicionar as configurações de Module Federation:

1.  Importe `getSharedDependencies` do SDK.
2.  Defina o `output.uniqueName`.
3.  Adicione o `ModuleFederationPluginV2` com o `filename` configurado (obrigatório).

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
      // 3. Adicionar ModuleFederationPlugin
      new Repack.plugins.ModuleFederationPluginV2({
        name: 'checkout', // NOME PARA O HOST REFERENCIAR
        filename: 'checkout.container.js.bundle', // OBRIGATÓRIO: Nome do arquivo do bundle container
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

### 2.6. Alinhar Dependências

Após configurar o `rnx-kit` no `package.json`, primeiro instale as dependências para que o SDK seja reconhecido no workspace, e então execute o alinhamento.

```bash
# Na raiz do monorepo
pnpm install
pnpm --filter <nome-do-pacote> align-deps
```
Ou se você adicionar o script no package.json do seu app.

## 3. Registrar no Host App

Para que o Host App consiga carregar seu novo mini-app:

1.  Abra `apps/host-app/rspack.config.mjs`.
2.  Adicione a entrada no objeto `remotes` do `ModuleFederationPlugin`:

```javascript
remotes: {
  // ...
  checkout: `checkout@http://localhost:9002/${platform}/mf-manifest.json`,
},
```
(Certifique-se de usar a mesma porta definida no script `start` do seu mini-app).

## 4. Usar no Host App

Simplesmente importe o componente federado no código do Host App:

```tsx
const CheckoutApp = React.lazy(() => import('checkout/App'));

// Uso
<React.Suspense fallback={<Text>Loading...</Text>}>
  <CheckoutApp />
</React.Suspense>
```

## 5. FAQ e Decisões Arquiteturais

### Por que remover o ESLint local?

Utilizamos o `@eduzz/eslint-config` que já gerencia as dependências do ESLint e Prettier de forma centralizada. Manter instalações locais causa conflitos de versão e comportamento de "looping" nas correções automáticas.

### Podemos automatizar essa limpeza?

Sim, é possível criar scripts pós-inicialização (`post-init`) que limpem o `package.json` programaticamente. Atualmente, o processo é manual ou garantido via `rnx-align-deps` (desde que as entradas manuais sejam removidas).

### Devemos criar um pacote separado para configuração?

Atualmente, o `packages/sdk` atua como a *Source of Truth* para versões de dependências (incluindo linter) através do `rnx-align-deps`. A configuração em si (`eslint.config.js`) é simples o suficiente para ser replicada via boilerplate ou importação direta, não necessitando de um pacote wrapper adicional além do SDK e da própria lib da Eduzz.
