# MFE POC Monorepo

Bem-vindo ao repositório de Prova de Conceito de Micro Frontends com React Native (Super App).

Este projeto utiliza um monorepo para gerenciar o **Host App** (Container Nativo) e diversos **Mini-Apps** (Micro Frontends) que são carregados dinamicamente via Module Federation (Re.Pack/Rspack).

## 📚 Índice de Documentação

Toda a documentação técnica encontra-se na pasta `/docs`. Abaixo está um guia rápido para o que você precisa:

### 🚀 Começando
*   **[Como rodar o projeto](docs/RUNNING_APP.md)**  
    *Guia essencial*. Aprenda a instalar as dependências, configurar o ambiente iOS/Android e rodar os servidores Metro do Host e dos Mini-Apps simultaneamente.

### 🛠️ Desenvolvimento
*   **[Criando um novo Mini-App](docs/CREATE_MINI_APP.md)**  
    Quer adicionar uma nova funcionalidade isolada? Siga este guia para criar um novo app, configurar o `rspack.config.mjs` e integrar ao Host.

*   **[Gerenciando Dependências e Bibliotecas](docs/MANAGE_DEPENDENCIES.md)**  
    Entenda a arquitetura de dependências: o que deve ser local, o que deve ser compartilhado (`shared`), como adicionar novas libs no SDK e o uso da flag `eager`.

### ⚙️ Arquitetura e Ferramentas
*   **[Alinhamento de Dependências (RNX Kit)](docs/RNX_ALIGN_DEPS.md)**  
    Explicação sobre o uso do `rnx-align-deps` para garantir consistência de versões (React, RN, Navigation) e evitar conflitos de "Multiple Instances of React".

