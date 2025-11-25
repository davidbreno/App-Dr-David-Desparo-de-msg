# 💚 Pulso do Consultório

> Sistema elegante de comunicação com pacientes via WhatsApp Business com visual cyberpunk e funcionalidades robustas.

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.3-61dafb)
![TypeScript](https://img.shields.io/badge/typescript-5.6-3178c6)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação no VS Code](#instalação-no-vs-code)
- [Como Rodar](#como-rodar)
- [Funcionalidades](#funcionalidades)
- [Paleta de Cores](#paleta-de-cores)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Usar](#como-usar)
- [Credenciais de Teste](#credenciais-de-teste)

---

## 🎯 Sobre o Projeto

**Pulso do Consultório** é uma aplicação web moderna para facilitar a comunicação entre consultórios médicos e seus pacientes via WhatsApp Business. 

### ✨ Destaques:

- 🎨 **Design Cyberpunk Poético** - Visual elegante com verde neon sobre fundo preto total
- 🔍 **Busca Inteligente** - Filtros por nome e idade em tempo real
- 📊 **Dashboard Completo** - Estatísticas e métricas visuais
- 📥 **Importação Robusta** - Aceita HTML, CSV e JSON com 5000+ registros
- 💬 **Templates de Mensagens** - Mensagens prontas personalizáveis
- 🌟 **Animações Fluidas** - Motion, glassmorphism e micro-interações

---

## 🛠 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **React 18.3** - Biblioteca JavaScript para interfaces
- **TypeScript 5.6** - Superset tipado do JavaScript
- **Tailwind CSS 4.0** - Framework CSS utilitário
- **Vite** - Build tool ultrarrápido
- **Motion/React** - Animações fluidas (Framer Motion)
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos
- **date-fns** - Manipulação de datas

---

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior)
  - [Download Node.js](https://nodejs.org/)
  - Verifique: `node --version`

- **npm** ou **yarn** (gerenciador de pacotes)
  - npm vem com Node.js
  - Verifique: `npm --version`

- **VS Code** (editor recomendado)
  - [Download VS Code](https://code.visualstudio.com/)

### 🔌 Extensões VS Code Recomendadas:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

---

## 🚀 Instalação no VS Code

### Passo 1: Criar o Projeto Vite + React

Abra o terminal e execute:

```bash
# Criar projeto com Vite
npm create vite@latest pulso-do-consultorio -- --template react-ts

# Entrar na pasta
cd pulso-do-consultorio
```

### Passo 2: Copiar os Arquivos

1. **Copie TODOS os arquivos** deste projeto para a pasta criada
2. Sobrescreva os arquivos padrão do Vite

### Passo 3: Configurar Tailwind CSS

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss@next @tailwindcss/vite@next
```

Crie o arquivo `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Passo 4: Instalar Dependências

```bash
# Instalar todas as dependências
npm install react react-dom
npm install lucide-react
npm install recharts
npm install date-fns
npm install motion
npm install react-slick @types/react-slick
npm install react-responsive-masonry
npm install react-dnd react-dnd-html5-backend
npm install sonner@2.0.3
npm install react-hook-form@7.55.0
```

### Passo 5: Configurar Vite

Edite o arquivo `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### Passo 6: Configurar index.html

Crie/edite o arquivo `index.html` na raiz:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pulso do Consultório</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Passo 7: Configurar Entry Point

Crie o arquivo `src/main.tsx`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Passo 8: Ajustar Imports

Como os arquivos estão na raiz, você precisa ajustar os imports. No arquivo `src/main.tsx`:

```typescript
import App from '../App'  // App.tsx está na raiz
import '../styles/globals.css'  // globals.css está em /styles
```

---

## ▶️ Como Rodar

### Modo Desenvolvimento

```bash
# Rodar o servidor de desenvolvimento
npm run dev
```

O app estará disponível em: **http://localhost:5173**

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Preview do build
npm run preview
```

### Comandos Úteis

```bash
# Instalar dependência
npm install nome-do-pacote

# Atualizar dependências
npm update

# Limpar cache
npm cache clean --force
```

---

## 🎨 Funcionalidades

### 🔐 Sistema de Login
- Autenticação básica com validação
- Feedback visual de erros
- Animações suaves de entrada

### 👥 Gestão de Pacientes
- **Busca em Tempo Real** - Filtro por nome instantâneo
- **Filtro por Idade** - Slider com range personalizável
- **Seleção Múltipla** - Selecionar/desselecionar todos
- **Modo Fantasma** - Ocultar pacientes temporariamente
- **Cards Interativos** - Hover effects e micro-interações

### 📥 Importação de Dados
- **Múltiplos Formatos**: HTML, CSV, JSON
- **Grande Volume**: Suporta 5000+ pacientes
- **Validação Inteligente**: Detecta formato automaticamente
- **Preview dos Dados**: Visualize antes de importar
- **Feedback Visual**: Progresso e estatísticas

### 💬 Envio de Mensagens
- **Templates Prontos**: 6 mensagens pré-configuradas
- **Editor Personalizado**: Crie suas próprias mensagens
- **Contador de Caracteres**: Controle o tamanho
- **Preview de Envio**: Veja quantos pacientes receberão
- **Integração WhatsApp**: Abre automaticamente o WhatsApp Web

### 📊 Dashboard e Análises
- **Gráficos Dinâmicos**: Recharts com animações
- **Métricas em Tempo Real**: Taxa de resposta, engajamento
- **Distribuição por Idade**: Visualização clara
- **Histórico de Atividades**: Últimas ações

### 📤 Mensagens Enviadas
- **Histórico Completo**: Todas as mensagens enviadas
- **Status de Entrega**: Enviada, Entregue, Lida
- **Filtros e Busca**: Encontre mensagens rapidamente

### 💬 Respostas
- **Feedback dos Pacientes**: Visualize todas as respostas
- **Análise de Sentimento**: Positivo, Neutro, Negativo
- **Tempo de Resposta**: Métricas de engajamento

### ⚙️ Configurações
- **Notificações**: Push, Email, Auto-resposta
- **Aparência**: Modo escuro (sempre ativo)
- **Idioma**: PT-BR, EN-US, ES-ES
- **Delay de Mensagens**: Configurável (100-5000ms)
- **Segurança**: Alterar senha, 2FA

---

## 🎨 Paleta de Cores

### Cores Principais

```css
/* Verde Neon - Principal */
#C8FF2E

/* Verde Limão - Secundário */
#B4FF4A

/* Verde Elétrico Escuro - Sombras */
#78A82F

/* Amarelo Esverdeado - Textos Secundários */
#D6FF57
```

### Cores de Fundo

```css
/* Preto Total - Fundo Principal */
#000000

/* Cinza Grafite - Containers */
#1A1A1A

/* Cinza Profundo - Cards Internos */
#0E0E0E

/* Branco - Textos */
#FFFFFF
```

### Aplicação

```typescript
// Gradientes
background: linear-gradient(135deg, #C8FF2E 0%, #78A82F 100%)

// Sombras Neon
box-shadow: 0 8px 32px rgba(200, 255, 46, 0.5)

// Glow no Hover
box-shadow: 0 12px 40px rgba(200, 255, 46, 0.6)

// Bordas Transparentes
border: 1px solid rgba(255, 255, 255, 0.1)
```

---

## 📁 Estrutura do Projeto

```
pulso-do-consultorio/
├── src/
│   └── main.tsx                 # Entry point
├── components/                  # Componentes React
│   ├── Login.tsx               # Tela de login
│   ├── Dashboard.tsx           # Dashboard principal
│   ├── PatientsList.tsx        # Lista de pacientes
│   ├── PatientCard.tsx         # Card individual
│   ├── AgeSlider.tsx           # Filtro de idade
│   ├── MessageComposer.tsx     # Compositor de mensagens
│   ├── TemplateSelector.tsx    # Seletor de templates
│   ├── ImportPatients.tsx      # Modal de importação
│   ├── Settings.tsx            # Configurações
│   ├── SentMessages.tsx        # Mensagens enviadas
│   ├── Responses.tsx           # Respostas recebidas
│   └── ui/                     # Componentes UI reutilizáveis
├── styles/
│   └── globals.css             # Estilos globais + Tailwind
├── App.tsx                      # Componente principal
├── index.html                   # HTML base
├── vite.config.ts              # Configuração Vite
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências
└── README.md                   # Este arquivo
```

---

## 📖 Como Usar

### 1️⃣ Fazer Login

Use as credenciais de teste:
- **Usuário:** `admin`
- **Senha:** `123456`

### 2️⃣ Importar Pacientes

Clique em **"Importar Pacientes"** e cole seus dados:

**Exemplo CSV:**
```csv
Ana Silva,34,11987654321,2024-11-20
Carlos Mendes,45,11976543210,2024-11-15
Maria Santos,28,11965432109,2024-11-18
João Oliveira,52,11954321098,2024-11-10
```

**Exemplo JSON:**
```json
[
  {
    "name": "Ana Silva",
    "age": 34,
    "phone": "11987654321",
    "lastVisit": "2024-11-20"
  }
]
```

### 3️⃣ Filtrar Pacientes

- Use a **busca** para encontrar por nome
- Ajuste o **slider de idade** para filtrar por faixa etária
- Combine ambos os filtros!

### 4️⃣ Selecionar Pacientes

- Clique nos **cards** para selecionar individualmente
- Use **"Selecionar Todos"** para marcar todos
- Use **"Limpar Seleção"** para desmarcar

### 5️⃣ Enviar Mensagens

1. Selecione os pacientes desejados
2. Escolha um **template** ou digite sua mensagem
3. Clique em **"Enviar para X pacientes"**
4. O WhatsApp Web abrirá automaticamente para cada contato

### 6️⃣ Acompanhar Resultados

- Veja o **Dashboard** para métricas gerais
- Acesse **"Enviadas"** para histórico
- Confira **"Respostas"** para feedback dos pacientes

---

## 🔑 Credenciais de Teste

### Login Padrão
```
Usuário: admin
Senha: 123456
```

⚠️ **Atenção**: Este é um sistema de demonstração. Para uso em produção, implemente autenticação segura com backend e criptografia.

---

## 🎭 Características de Design

### Glassmorphism
- Fundos semi-transparentes
- Blur effects sutis
- Bordas luminosas

### Animações Motion
```typescript
// Exemplo de animação
import { motion } from 'motion/react'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo
</motion.div>
```

### Efeitos 3D
- Transform no hover
- Perspectiva em cards
- Sombras dinâmicas

### Micro-interações
- Ripple effects
- Feedback tátil visual
- Transições suaves

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: Tailwind não funciona
```bash
# Verificar se @tailwindcss/vite está instalado
npm install -D @tailwindcss/vite@next

# Verificar vite.config.ts
```

### Erro: Port 5173 já está em uso
```bash
# Usar outra porta
npm run dev -- --port 3000
```

### Build falha
```bash
# Limpar cache e rebuildar
npm run build -- --force
```

---

## 📱 Responsividade

O app é totalmente responsivo:

- **Desktop** (1920px+): Layout completo com sidebar
- **Tablet** (768px-1919px): Layout adaptado
- **Mobile** (320px-767px): Layout otimizado mobile-first

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este é um projeto de demonstração!

Para produção, implemente:
- ✅ Autenticação JWT ou OAuth
- ✅ Backend com API segura
- ✅ Criptografia de dados sensíveis
- ✅ HTTPS obrigatório
- ✅ Rate limiting
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Validação server-side

---

## 📝 Licença

Este projeto é para fins educacionais e de demonstração.

---

## 👨‍💻 Desenvolvido com

- ☕ Café
- 💚 Amor por código limpo
- 🎨 Obsessão por detalhes
- ✨ Visual cyberpunk poético

---

## 🙋‍♂️ Dúvidas?

Se tiver problemas:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se que está usando Node.js 18+
3. Limpe o cache: `npm cache clean --force`
4. Reinstale: `rm -rf node_modules && npm install`
5. Tente rodar: `npm run dev`

---

**🚀 Bom desenvolvimento! Que o verde neon esteja com você! 💚**
