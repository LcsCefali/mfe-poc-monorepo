# Adição de Novas Bibliotecas

Gerenciar dependências em um ambiente de Module Federation requer cuidado extra para evitar duplicação de código nos bundles e erros de runtime.

Existem dois tipos principais de dependências: **Locais** e **Compartilhadas**.

## 1. Bibliotecas Locais (Específicas do Mini-App)

Se uma biblioteca é usada **apenas** dentro de um mini-app e não precisa compartilhar estado ou instância com o Host ou outros apps (ex: `lodash`, `date-fns` - bibliotecas utilitárias puras), você pode instalá-la normalmente no `package.json` do app.

```bash
cd apps/catalog-app
pnpm add lodash
```

O `Repack` irá empacotar essa lib dentro do bundle do `catalog-app`.

## 2. Bibliotecas Compartilhadas (Shared Dependencies)

Bibliotecas que precisam ser **singletons** (única instância na memória) ou que são muito pesadas e devem ser compartilhadas entre Host e Mini-Apps (ex: `react`, `react-native`, `react-navigation`, bibliotecas de UI Kit, State Management) devem ser gerenciadas centralmente.

### Passo a Passo para adicionar:

1.  **Adicionar no SDK:**
    Edite o arquivo `packages/sdk/dependencies.json`. Adicione a biblioteca, a versão e se ela deve ser marcada como `shared` no Module Federation.

    ```json
    {
      "minha-nova-lib": {
        "version": "1.2.3",
        "shared": true
      }
    }
    ```
    *   `shared: true`: Será passada para o `ModuleFederationPlugin` como shared module.
    *   `shared: false`: Apenas força a versão via `rnx-align-deps`, mas não configura compartilhamento de bundle (cada app terá sua cópia, mas da mesma versão).

2.  **Atualizar o Pacote SDK (opcional):**
    Se a lib precisa ser instalada no próprio SDK para ser exportada de lá, adicione também no `package.json` do SDK (se aplicável), ou apenas no `dependencies.json` se for apenas para governança.

3.  **Alinhar Dependências nos Apps:**
    Agora você precisa propagar essa nova dependência (ou versão) para os apps.

    ```bash
    pnpm align-deps
    ```

    Isso vai percorrer todos os apps e adicionar/corrigir a `minha-nova-lib` no `package.json` dos apps com a versão `1.2.3`.

4.  **Instalar:**
    Rode `pnpm install` na raiz para baixar os pacotes.

5.  **Verificar `rspack.config.mjs`:**
    O nosso setup utiliza `getSharedDependencies()` do SDK no `rspack.config.mjs`. Se você marcou `"shared": true` no JSON, ela automaticamente será incluída na lista de compartilhados no próximo build.

    ```javascript
    // apps/catalog-app/rspack.config.mjs
    shared: getSharedDependencies({ eager: false }),
    ```

    **Entendendo a flag `eager`:**
    
    A função `getSharedDependencies` aceita um objeto de opções onde você define `{ eager: boolean }`.
    
    *   **`eager: true` (Geralmente usado no Host App):**
        Instrui o Module Federation a carregar essas dependências compartilhadas *imediatamente* junto com o bundle inicial do aplicativo.
        *   **Por que no Host?** O Host App não pode "esperar" para carregar o React ou React Native; ele precisa dessas libs prontas assim que o app inicia para renderizar a raiz. Se essas libs não forem eager, o app pode falhar ao iniciar com erro de "Shared module is not available for eager consumption".
    
    *   **`eager: false` (Geralmente usado nos Mini-Apps):**
        Instrui o Module Federation a carregar essas dependências *apenas se elas ainda não tiverem sido carregadas*.
        *   **Por que nos Mini-Apps?** Como o Host já carregou o React (eager), o Mini-App não precisa trazer sua própria cópia nem carregá-lo de novo. Ele simplesmente usa a versão que já está na memória fornecida pelo Host. Isso reduz drasticamente o tamanho do bundle do Mini-App.

## Resumo da Regra

*   **Vai usar React Context?** -> Shared (Adicionar no SDK)
*   **É React Native Core?** -> Shared (Adicionar no SDK)
*   **É lib de UI pesada?** -> Shared (Adicionar no SDK e Host)
*   **É utilitário pequeno (helper)?** -> Local (Adicionar direto no App)
