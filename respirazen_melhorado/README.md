
# RespiraZen - Aplicativo de Respiração Guiada e Meditação

## 🌟 Sobre o Projeto

RespiraZen é um aplicativo web moderno e completo para respiração guiada e meditação mindfulness. Desenvolvido com React, TypeScript e Vite, oferece uma experiência imersiva para usuários que buscam bem-estar mental e redução do estresse.

## ✨ Funcionalidades Principais

### 1. 🏠 Homepage Interativa
- **Seção de Benefícios**: 4 cards animados destacando benefícios da meditação
- **Como Funciona**: Explicação visual do ciclo de respiração
- **Animações Framer Motion**: Transições suaves e efeitos visuais
- **CTA Otimizado**: Botões para iniciar exercícios e explorar comunidade

### 2. 🫁 Sistema de Respiração Avançado
- **Círculo de Respiração Interativo**: Animações fluidas com feedback visual em tempo real
- **Múltiplos Padrões**: Box Breathing (4-4-4-4), 4-7-8, Coerência (5-5-5)
- **Personalização Completa**: Configuração custom de timing para cada fase
- **Feedback Visual Dinâmico**: Cores diferentes para cada fase (inspirar, segurar, expirar)
- **Vibração Opcional**: Feedback tátil nas mudanças de fase

### 3. 🌓 Sistema de Tema Completo
- **Modo Escuro/Claro**: Toggle suave entre temas
- **CSS Variables**: Sistema de design consistente
- **Detecção Automática**: Respeita preferência do sistema
- **Persistência**: Salva preferência do usuário

### 4. 📊 Dashboard de Progresso
- **Estatísticas Detalhadas**: Sessões totais, minutos praticados, sequência atual
- **Gráficos Interativos**: Recharts com dados dos últimos 7 dias
- **LocalStorage**: Persistência de dados offline
- **Compartilhamento**: Web Share API para compartilhar conquistas

### 5. 🤝 Sistema de Comunidade
- **Feed de Posts**: Interface similar a redes sociais
- **Sistema de Likes**: Interação com posts da comunidade
- **Categorias**: Marcos, dicas, respiração, meditação
- **Compartilhamento**: Funcionalidade de compartilhar posts
- **Mockup Realístico**: Dados simulados para demonstração

### 6. 📱 PWA Completo
- **Manifest.json**: Configuração completa para instalação
- **Service Worker**: Cache inteligente e funcionamento offline
- **Ícones Adaptativos**: Suporte a diferentes tamanhos e dispositivos
- **Shortcuts**: Ações rápidas na tela inicial
- **Background Sync**: Sincronização de dados quando online

### 7. 🎯 Onboarding Intuitivo
- **Modal de Boas-vindas**: 4 etapas explicando o app
- **Tour Guiado**: React Joyride destacando elementos principais
- **Verificação Inteligente**: Só aparece para novos usuários
- **Skip/Avançar**: Controle total do usuário

## 🛠 Tecnologias Utilizadas

### Core
- **React 18**: Biblioteca principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool moderna e rápida

### Styling & UI
- **Tailwind CSS**: Framework CSS utilitário
- **Framer Motion**: Animações e transições
- **Radix UI**: Componentes primitivos acessíveis
- **Lucide React**: Ícones modernos

### Funcionalidades
- **React Router DOM**: Roteamento SPA
- **Recharts**: Gráficos e visualizações
- **React Joyride**: Tours guiados
- **LocalStorage**: Persistência offline

### PWA & Performance
- **Vite PWA Plugin**: Configuração automática de PWA
- **Service Worker**: Cache e offline support
- **Web Share API**: Compartilhamento nativo

## 🚀 Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/usuario/respirazen-melhorado.git

# Entre no diretório
cd respirazen-melhorado

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Breathing/
│   │   ├── ImprovedBreathingCircle.tsx
│   │   └── CustomPatternModal.tsx
│   ├── Community/
│   │   └── Community.tsx
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── HomePage/
│   │   ├── BenefitsSection.tsx
│   │   └── HowItWorksSection.tsx
│   ├── Layout/
│   │   └── ImprovedHeader.tsx
│   ├── Onboarding/
│   │   ├── OnboardingModal.tsx
│   │   └── OnboardingTour.tsx
│   └── ui/ (componentes Shadcn/ui)
├── context/
│   └── ImprovedThemeContext.tsx
├── hooks/
│   └── useOnboarding.ts
├── pages/
│   ├── ImprovedIndex.tsx
│   ├── ImprovedBreathing.tsx
│   ├── DashboardPage.tsx
│   └── CommunityPage.tsx
└── data/
    └── mock-posts.json
```

## 🌟 Características Técnicas

### Performance
- ⚡ Vite para build ultrarrápido
- 🎨 CSS-in-JS com Tailwind para bundle otimizado
- 🖼️ Lazy loading de componentes pesados
- 📦 Code splitting automático

### Acessibilidade
- ♿ Componentes Radix UI com suporte completo
- ⌨️ Navegação por teclado
- 🔊 Screen reader friendly
- 🎯 Focus management adequado

### Responsividade
- 📱 Mobile-first design
- 💻 Desktop otimizado
- 🖥️ Tablet support
- 📐 Breakpoints consistentes

### UX/UI
- 🎭 Animações sutis e significativas
- 🎨 Design system consistente
- 💡 Feedback visual imediato
- 🔄 Estados de loading elegantes

## 📊 Funcionalidades de Dados

### Persistência Local
- ✅ Sessões completadas
- ⏱️ Tempo total praticado
- 🔥 Sequências (streaks)
- ⚙️ Configurações personalizadas
- 🎯 Preferências de tema

### Analytics Implementados
- 📈 Progresso semanal
- 📊 Tipos de sessão
- 🏆 Conquistas e marcos
- 📅 Histórico detalhado

## 🔄 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] Integração com Firebase para sync
- [ ] Notificações push personalizadas
- [ ] Mais padrões de respiração
- [ ] Sistema de badges/conquistas
- [ ] Integração com wearables
- [ ] Modo offline completo

### Melhorias Técnicas
- [ ] Testes unitários e E2E
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Analytics avançados

## 🤝 Contribuição

Este projeto está aberto para contribuições! Sinta-se livre para:
1. Fazer fork do projeto
2. Criar uma branch para sua feature
3. Fazer commit das mudanças
4. Push para a branch
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Comunidade React e ecosystem
- Designers de UX/UI que inspiraram o design
- Pesquisadores em mindfulness e bem-estar
- Todos os contribuidores e usuários do RespiraZen

---

**RespiraZen** - Transformando vidas, uma respiração de cada vez. 🧘‍♀️✨
