# 🎭 App Cordel – Registre sua história

[![Expo](https://img.shields.io/badge/Expo-51.0-black.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.74-blue.svg)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10.11-orange.svg)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)

> **Slogan:** _Registre sua história_

---

## 📖 Sobre o Projeto

**App Cordel** é um aplicativo mobile para **registro e gestão de ocorrências e feedbacks** em espaços culturais (teatros, museus, centros culturais), desenvolvido como projeto extensionista da disciplina **Desenvolvimento de Plataformas Móveis**.

O nome "Cordel" remete à tradição da literatura de cordel nordestina – uma forma popular e acessível de contar histórias. Assim como o cordel, este aplicativo dá voz ao público, permitindo que visitantes registrem suas experiências e contribuam para a melhoria dos espaços culturais.

> ⚠️ **Atenção importante:** Este aplicativo **NÃO possui caráter jurídico ou oficial**. É uma ferramenta de coleta de feedback e apoio à gestão interna. Não devem ser feitas denúncias contra pessoas específicas.

### 🎯 Objetivo

Melhorar a experiência do público em espaços culturais, fornecendo aos gestores dados reais sobre:

- Problemas recorrentes (estrutura, atendimento, acessibilidade, limpeza)
- Nível de satisfação dos visitantes
- Sugestões de melhoria

### 👥 Público-alvo

| Perfil            | Descrição                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Visitante**     | Frequentadores de espaços culturais que desejam registrar feedbacks e avaliar sua experiência         |
| **Administrador** | Gestores e organizadores de espaços culturais que monitoram os feedbacks e tomam decisões de melhoria |

---

## 🛠 Tecnologias Utilizadas

### Frontend (Mobile)

| Tecnologia                 | Versão | Finalidade                                                                     |
| -------------------------- | ------ | ------------------------------------------------------------------------------ |
| **React Native (Expo)**    | SDK 51 | Framework para desenvolvimento mobile multiplataforma (Android e iOS)          |
| **TypeScript**             | 5.3+   | Tipagem estática para maior segurança e manutenibilidade do código             |
| **Expo Go**                | -      | Aplicativo para testar o app em tempo real no celular sem necessidade de build |
| **React Navigation**       | 6.x    | Navegação entre telas (Stack Navigator + Bottom Tabs)                          |
| **Expo Notifications**     | 0.28   | Notificações push para avisar visitantes sobre atualizações de status          |
| **React Native Chart Kit** | 6.12   | Geração de gráficos para o painel de estatísticas do administrador             |
| **React Native Picker**    | 2.7    | Seleção de tipos de ocorrência (estrutura, atendimento, etc.)                  |
| **Date-fns**               | 3.6    | Manipulação e formatação de datas                                              |

### Backend e Persistência

| Tecnologia                  | Versão | Finalidade                                                             |
| --------------------------- | ------ | ---------------------------------------------------------------------- |
| **Firebase Authentication** | 10.11  | Gerenciamento de usuários (login e cadastro)                           |
| **Firebase Firestore**      | 10.11  | Banco de dados NoSQL para armazenar ocorrências, avaliações e usuários |
| **Firebase Security Rules** | -      | Regras de segurança para proteger os dados dos usuários                |

### Ferramentas de Desenvolvimento

| Ferramenta       | Finalidade                                   |
| ---------------- | -------------------------------------------- |
| **VS Code**      | Editor de código principal                   |
| **Git & GitHub** | Controle de versão e colaboração             |
| **Expo Snack**   | Ambiente de prototipagem rápido no navegador |
| **npm**          | Gerenciador de pacotes                       |

---

## 📱 Funcionalidades

### Visitante

- ✅ Registrar ocorrência/feedback (tipo, descrição, data, local)
- ✅ Avaliar experiência (nota de 1 a 5 estrelas + comentário opcional)
- ✅ Visualizar histórico de feedbacks enviados
- ⏳ Editar/excluir ocorrências pendentes (desejável)
- ⏳ Receber notificações de mudança de status (desejável)

### Administrador

- ✅ Visualizar todas as ocorrências registradas
- ✅ Filtrar por período e por evento/local (recurso diferencial)
- ✅ Painel de estatísticas (tipos mais frequentes + média de avaliações)
- ⏳ Alterar status das ocorrências (Pendente → Em análise → Resolvida)
- ⏳ Exportar relatório em PDF/CSV (opcional)

---

## 🚀 Como Replicar o Projeto (do zero no VS Code)

### Pré-requisitos

Antes de começar, instale os seguintes programas:

| Software    | Versão           | Link para download                                             |
| ----------- | ---------------- | -------------------------------------------------------------- |
| **Node.js** | 18.x ou superior | [https://nodejs.org](https://nodejs.org)                       |
| **VS Code** | Última versão    | [https://code.visualstudio.com](https://code.visualstudio.com) |
| **Git**     | Última versão    | [https://git-scm.com](https://git-scm.com)                     |
| **Expo Go** | Última versão    | Loja de aplicativos do celular (Android/iOS)                   |

### Passo 1: Clonar o repositório

Abra o terminal (ou PowerShell no Windows) e execute:

```bash
# Acesse a pasta onde deseja salvar o projeto
cd Desktop

# Clone o repositório
git clone https://github.com/LucasFigs/OcorrenciasCulturais.git

## Entre na pasta do projeto
cd OcorrenciasCulturais
```

## Passo 2: Abrir o projeto no VS Code

Abrir o VS Code diretamente do terminal

Ou manualmente: abra o VS Code → Arquivo → Abrir Pasta → selecione a pasta OcorrenciasCulturais.

## Passo 3: Instalar as dependências

No terminal do VS Code (ou terminal integrado Ctrl + '):

```bash
npm install
```

## Passo 4: Configurar o Firebase

Criar um projeto no Firebase

#### 1. Acesse https://console.firebase.google.com

#### 2. Clique em "Adicionar projeto" → dê o nome (ex: "app-cordel")

#### 3. Desabilite o Google Analytics (opcional)

#### 4. Clique em "Criar projeto"

Ativar os serviços necessários

- Authentication: Vá em "Authentication" → "Sign-in methods" → ative "E-mail/senha" e "Login anônimo"

- Firestore Database: Vá em "Firestore Database" → "Criar banco de dados" → modo de testes (para desenvolvimento)

Obter as credenciais do Firebase

#### 1. Vá em "Configurações do projeto" (ícone de engrenagem)

#### 2. Em "Seus aplicativos", clique em "</>" (adicionar app web)

#### 3. Registre o app com um nome (ex: "App Cordel")

#### 4. Copie o objeto firebaseConfig:

```javascript
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'seu-projeto.firebaseapp.com',
  projectId: 'seu-projeto',
  storageBucket: 'seu-projeto.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
};
```

Configurar o arquivo do Firebase no projeto

- Crie o arquivo src/services/firebaseConfig.ts com o seguinte conteúdo:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'seu-projeto.firebaseapp.com',
  projectId: 'seu-projeto',
  storageBucket: 'seu-projeto.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

🔒 Segurança: Nunca commite este arquivo com credenciais reais. Adicione src/services/firebaseConfig.ts no .gitignore ou use variáveis de ambiente.

## Passo 5: Executar o projeto

```bash
# Iniciar o servidor de desenvolvimento
npx expo start
```

Um terminal interativo será aberto. Você verá opções e um QR Code.

## Passo 6: Testar no celular

Opção A – Android

#### 1. Instale o app Expo Go na Google Play Store

#### 2. Escaneie o QR Code exibido no terminal/VS Code

#### 3. O app será carregado automaticamente

Opção B – iOS

#### 1. Instale o app Expo Go na App Store

#### 2. Abra o app Câmera do iPhone e escaneie o QR Code

#### 3. Toque na notificação para abrir no Expo Go

Opção C – Emulador (se não tiver celular)

```bash
# Para Android (requer Android Studio)
npx expo start --android

# Para iOS (requer Mac com Xcode)
npx expo start --ios
```

## Passo 7: Build de produção (APK para Android)

Quando o projeto estiver completo, gere um APK para instalação em qualquer celular:

```bash
# Instalar o EAS CLI
npm install -g eas-cli

# Fazer login na conta Expo
eas login

# Configurar o build
eas build:configure

# Gerar APK
eas build --platform android --profile preview
```

O APK será gerado na nuvem e você receberá um link para download.

📁 Estrutura do Projeto

```text
OcorrenciasCulturais/
├── App.tsx                      # Ponto de entrada principal
├── app.json                     # Configurações do Expo
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração do TypeScript
├── .gitignore                   # Arquivos ignorados pelo Git
│
├── src/
│   ├── screens/                 # Telas do aplicativo
│   │   ├── LoginScreen.tsx
│   │   ├── VisitanteHomeScreen.tsx
│   │   ├── NovaOcorrenciaScreen.tsx
│   │   ├── AvaliacaoScreen.tsx
│   │   ├── HistoricoScreen.tsx
│   │   ├── AdminHomeScreen.tsx
│   │   ├── EstatisticasScreen.tsx
│   │   └── FiltroScreen.tsx
│   │
│   ├── components/              # Componentes reutilizáveis
│   │   ├── Botao.tsx
│   │   ├── CardOcorrencia.tsx
│   │   ├── EstrelasRating.tsx
│   │   └── GraficoTipos.tsx
│   │
│   ├── services/                # Serviços e integrações
│   │   ├── firebaseConfig.ts
│   │   ├── authService.ts
│   │   └── ocorrenciaService.ts
│   │
│   ├── navigation/              # Configuração de rotas
│   │   └── AppNavigator.tsx
│   │
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts
│   │
│   └── utils/                   # Funções auxiliares
│       └── helpers.ts
│
├── assets/                      # Imagens, ícones, fontes
│   ├── icon.png
│   └── splash.png
│
└── README.md                    # Este arquivo
```

## 🔧 Scripts Disponíveis

No diretório do projeto, você pode executar:

| Comando                                         | Descrição                                  |
| ----------------------------------------------- | ------------------------------------------ |
| `npm start` ou `npx expo start`                 | Inicia o servidor de desenvolvimento       |
| `npm run android` ou `npx expo start --android` | Inicia no emulador Android                 |
| `npm run ios` ou `npx expo start --ios`         | Inicia no simulador iOS (apenas Mac)       |
| `npx expo start --web`                          | Executa no navegador (versão web limitada) |
| `npx expo start -c`                             | Limpa o cache do Metro bundler             |
| `npx expo doctor`                               | Verifica problemas de configuração         |

---

## 🧪 Testando o App

### Contas de teste

| Perfil        | E-mail              | Senha  |
| ------------- | ------------------- | ------ |
| Visitante     | visitante@teste.com | 123456 |
| Administrador | admin@teste.com     | 123456 |

> **Observação:** Caso login seja necessário no app, crie estas contas no Firebase Authentication manualmente antes de testar.

### Fluxos para testar

#### Visitante:

1. Criar conta ou fazer login
2. Registrar uma nova ocorrência
3. Dar uma nota (avaliação)
4. Verificar se apareceu no histórico

#### Administrador:

1. Fazer login com conta admin (sugere-se pré-configurar um usuário com campo `perfil: "admin"` no Firestore)
2. Visualizar todas as ocorrências
3. Aplicar filtros por data
4. Ver gráficos de estatísticas

## 👥 Equipe

| Nome                        | RA      | GitHub                                           |
| --------------------------- | ------- | ------------------------------------------------ |
| Lucas Figueredo de Oliveira | 2427447 | [@LucasFigs](https://github.com/LucasFigs)       |
| Samuel Brito                | 2410541 | [@SamuelBrito](https://github.com/samuelbrito)   |
| Adryan Uchôa                | 2417363 | [@AdryanUchoa](https://github.com/adryans)       |
| Ariel Dias                  | 2412871 | [@ArielDias](https://github.com/arieldias)       |
| Artur Barroso               | 2416748 | [@ArturBarroso](https://github.com/arturbarroso) |

---

## ⚠️ Restrições do Projeto (definidas pela professora)

| Regra | Orientações                                           |
| ----- | ----------------------------------------------------- |
| ❌    | Não permitir denúncias contra pessoas específicas     |
| ❌    | Não se apresentar como canal oficial ou jurídico      |
| ❌    | Evitar linguagem jurídica no texto do app             |
| ✅    | Utilizar linguagem clara, amigável e acessível        |
| ✅    | Seguir diretrizes de acessibilidade WCAG 2.1 nível AA |

---

## 📚 Referências e Links Úteis

| Recurso                     | Link                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| Documentação do Expo        | [https://docs.expo.dev](https://docs.expo.dev)                                                         |
| Documentação do Firebase    | [https://firebase.google.com/docs](https://firebase.google.com/docs)                                   |
| React Navigation            | [https://reactnavigation.org](https://reactnavigation.org)                                             |
| TypeScript com React Native | [https://reactnative.dev/docs/typescript](https://reactnative.dev/docs/typescript)                     |
| Repositório do Projeto      | [https://github.com/LucasFigs/OcorrenciasCulturais](https://github.com/LucasFigs/OcorrenciasCulturais) |

---

## 📄 Licença

Projeto acadêmico – sem fins comerciais. Desenvolvido para a disciplina **Desenvolvimento de Plataformas Móveis** sob orientação da Prof.ª Lyndainės Santos.

---

**Última atualização:** Abril de 2026  
**Repositório:** [https://github.com/LucasFigs/OcorrenciasCulturais](https://github.com/LucasFigs/OcorrenciasCulturais)  
**Slogan:** _Registre sua história_
