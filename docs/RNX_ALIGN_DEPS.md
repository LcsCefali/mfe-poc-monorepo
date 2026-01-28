# Uso do RNX-Align-Deps

O `rnx-align-deps` é uma ferramenta do Microsoft RNX Kit usada para gerenciar e alinhar dependências em um monorepo React Native. Ele garante que todos os pacotes consumam versões compatíveis de bibliotecas críticas (como `react`, `react-native`, `react-navigation`, etc), evitando problemas de "Multiple Instances of React" e incompatibilidades binárias.

## Como funciona no projeto

No nosso projeto, a "verdade única" sobre as versões das dependências está definida no `packages/sdk`.

1.  **packages/sdk/dependencies.json**: Define as versões exatas das libs compartilhadas.
2.  **packages/sdk/preset.js**: Exporta um preset que combina essas deps com as capacidades do SDK.

Cada aplicativo (`apps/*`) possui uma configuração no `package.json` apontando para esse preset.

### Configuração no `package.json` do App

```json
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
```

## Como utilizar

Sempre que você adicionar uma nova dependência, modificar o `package.json` manualmente, ou atualizar o SDK, você deve rodar o comando de alinhamento.

Execute na raiz do monorepo:

```bash
# Verifica e ajusta dependências para um app específico
pnpm rnx-align-deps apps/catalog-app --write
```

Ou para todos os pacotes (se configurado script recursivo ou rodando um por um):

```bash
# Exemplo genérico
npx rnx-align-deps --write
```

A flag `--write` autoriza a ferramenta a modificar seu `package.json` removendo versões conflitantes e configurando as versões corretas definidas no preset.

Se você esquecer de rodar, pode encontrar erros de build ou runtime devido a versões desencontradas de bibliotecas core.

## FAQ / Troubleshooting

### Por que ele pede para instalar dependências que eu não uso?
Se o `rnx-align-deps` está exigindo bibliotecas (como `@react-navigation` ou outras) que seu código não importa, é porque na configuração do `package.json` você incluiu a capability `mfe-app`.

```json
"capabilities": [
  "mfe-app" 
]
```

O perfil `mfe-app` (definido no SDK) agrupa todas as dependências padrão da arquitetura. 
*   **Recomendado:** Mantenha instalado. Isso garante que seu app siga o padrão da plataforma e evita erros caso você precise usar essas libs no futuro. Como são versões compartilhadas (`shared`), o impacto no bundle final é nulo (o código vem do Host).
*   **Alternativa:** Se você quer um controle granular e minimalista, remova `mfe-app` e liste apenas as capabilities individuais que deseja:
    ```json
    "capabilities": [
      "react",
      "react-native"
    ]
    ```

Também é possível rodar sem a flag para modificar, assim podemos gerar um relatório antes de prosseguir.

```bash
pnpm rnx-align-deps apps/catalog-app
```