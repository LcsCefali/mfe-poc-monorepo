# Passo a Passo: Executando o Projeto

Este guia cobre como clonar, instalar e rodar o ecossistema de micro-frontends (Host e Mini-Apps).

## Pré-requisitos

- Node.js (Versão recomendada no `.nvmrc` ou LTS)
- PNPM (`npm install -g pnpm`)
- Configuração de ambiente para React Native (Android Studio / Xcode)
- Ruby (para CocoaPods no iOS)

## 1. Instalação

Na raiz do monorepo, instale todas as dependências:

```bash
pnpm install
```

Isso irá instalar as dependências de todos os apps e pacotes do workspace.

## 2. Instalação de Pods (iOS)

Se você for rodar no iOS, precisa instalar os pods para cada app que deseja executar nativamente (geralmente só o Host App). Criamos um script utilitário para facilitar:

```bash
# Sintaxe: pnpm pod-install <nome-da-pasta-do-app>

# Exemplo: Instalar pods do Host App
pnpm pod-install host-app

# Exemplo: Instalar pods de um App específico (se for rodar standalone)
pnpm pod-install catalog-app
```

## 3. Rodando os Servidores Metro (Packagers)

Para que o Module Federation funcione localmente, você precisa rodar o servidor Metro do Host e de cada Mini-App que deseja carregar.

Abra terminais separados para cada serviço:

**Terminal 1: Catalog App**
```bash
pnpm start:catalog
# Roda na porta 9001
```

**Terminal 2: Rootzz App (Exemplo)**
```bash
pnpm start:rootzz
# Roda na porta 9000
```

**Terminal 3: Outros apps...**
Verifique o `package.json` na raiz para ver os scripts disponíveis (`start:checkout`, etc).

## 4. Rodando o Aplicativo Nativo (Host)

O Host App é o "container" nativo que irá carregar os javascript bundles dos mini-apps.

**Terminal 4: Host App (Metro)**
```bash
pnpm start:host
```

**Terminal 5: Lançar no Dispositivo/Emulador**

Para Android:
```bash
pnpm run:host:android
```

Para iOS:
```bash
pnpm run:host:ios
```

O aplicativo deve abrir, conectar ao Metro do Host, e carregar os bundle dos mini-apps conforme você navega ou conforme eles são requisitados.
