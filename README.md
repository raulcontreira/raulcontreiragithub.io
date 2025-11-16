# Weather PWA ☁️

Progressive Web App de previsão do tempo com dados em tempo real fornecidos pela API OpenWeatherMap.

## 📱 Características

- **PWA Completo**: Instalável, funciona offline e oferece experiência nativa
- **Dados em Tempo Real**: Integração com OpenWeatherMap API
- **Previsão Estendida**: Visualize a previsão do tempo para os próximos 5 dias
- **Geolocalização**: Detecta automaticamente sua localização
- **Design Responsivo**: Interface moderna e adaptável para todos os dispositivos
- **Service Worker**: Cache inteligente para funcionalidade offline
- **Backend API**: Node.js/Express com cache de requisições
- **Containerizado**: Docker e Docker Compose para fácil deploy
- **Testes E2E**: Cobertura completa com Playwright
- **CI/CD**: Pipeline automatizado com GitHub Actions

## 🏗️ Arquitetura

```
weather-pwa/
├── client/                 # Frontend React + Vite
│   ├── public/
│   │   ├── icons/         # Ícones PWA (192x192, 512x512)
│   │   ├── manifest.webmanifest
│   │   └── sw.js          # Service Worker
│   └── src/
│       ├── pages/         # Páginas da aplicação
│       ├── components/    # Componentes reutilizáveis
│       └── lib/           # Utilitários e configurações
├── server/                # Backend Node.js/Express
│   ├── routers.ts         # Rotas tRPC
│   ├── weatherService.ts  # Integração OpenWeatherMap
│   └── _core/            # Configurações do servidor
├── tests/
│   └── e2e/              # Testes E2E com Playwright
├── .github/
│   └── workflows/        # CI/CD GitHub Actions
├── docker-compose.yml    # Orquestração de containers
├── Dockerfile.api        # Container do backend
├── Dockerfile.web        # Container do frontend
└── nginx.conf           # Configuração Nginx
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20.x ou superior
- pnpm 10.x ou superior
- Docker e Docker Compose (opcional)

### Desenvolvimento Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd weather-pwa
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
OPENWEATHER_API_KEY=sua_chave_api_aqui
DATABASE_URL=sua_url_database
JWT_SECRET=seu_jwt_secret
VITE_APP_TITLE=Weather PWA
```

4. **Inicie o servidor de desenvolvimento**
```bash
pnpm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Executar com Docker Compose

1. **Configure as variáveis de ambiente**

Crie um arquivo `.env` com as variáveis necessárias (veja acima).

2. **Inicie os containers**
```bash
docker compose up --build
```

Serviços disponíveis:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

3. **Parar os containers**
```bash
docker compose down
```

## 🧪 Testes

### Testes Unitários
```bash
pnpm run test
```

### Testes E2E
```bash
# Executar todos os testes
pnpm run test:e2e

# Executar com interface visual
pnpm run test:e2e:ui

# Executar com navegador visível
pnpm run test:e2e:headed

# Ver relatório dos testes
pnpm run test:e2e:report
```

## 📡 API Endpoints

### Weather API (tRPC)

Todos os endpoints estão disponíveis através do tRPC em `/api/trpc`.

#### `weather.getCurrentByCity`
Busca o tempo atual por nome da cidade.

**Input:**
```typescript
{ city: string }
```

**Output:**
```typescript
{
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: Date;
}
```

#### `weather.getCurrentByCoords`
Busca o tempo atual por coordenadas geográficas.

**Input:**
```typescript
{ lat: number; lon: number }
```

**Output:** Mesmo formato de `getCurrentByCity`

#### `weather.getForecast`
Busca a previsão de 5 dias para uma cidade.

**Input:**
```typescript
{ city: string }
```

**Output:**
```typescript
Array<{
  date: Date;
  temperature: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}>
```

## 🔧 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **tRPC** - Type-safe API client
- **Wouter** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **tRPC** - Type-safe API
- **TypeScript** - Tipagem estática
- **Zod** - Validação de schemas

### DevOps & Testes
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Playwright** - Testes E2E
- **Vitest** - Testes unitários
- **GitHub Actions** - CI/CD
- **Lighthouse CI** - Auditoria de performance

## 📊 CI/CD Pipeline

O projeto possui um pipeline completo de CI/CD configurado no GitHub Actions:

1. **Build & Test**
   - Type checking
   - Build da aplicação
   - Testes unitários
   - Testes E2E com Playwright
   - Upload de artefatos

2. **Lighthouse CI**
   - Auditoria de performance
   - Verificação de PWA
   - Relatórios de acessibilidade e SEO

3. **Docker Build**
   - Build das imagens Docker
   - Validação do Docker Compose

## 🌐 Deploy

### GitHub Pages

Para fazer deploy no GitHub Pages:

1. Configure os secrets no repositório:
   - `OPENWEATHER_API_KEY`
   - Outros secrets necessários

2. O pipeline de CI/CD automaticamente fará o build e deploy quando houver push na branch `main`

### Outros Provedores

A aplicação pode ser facilmente deployada em:
- **Vercel**: Suporte nativo para Vite
- **Netlify**: Deploy automático via Git
- **Railway**: Suporte para Docker Compose
- **Heroku**: Deploy via Dockerfile
- **AWS/GCP/Azure**: Deploy via containers

## 📝 Funcionalidades PWA

### Manifest
O arquivo `manifest.webmanifest` define:
- Nome e descrição da aplicação
- Ícones para instalação
- Cores do tema
- Modo de exibição standalone

### Service Worker
O service worker implementa:
- **Cache First** para assets estáticos
- **Network First** para requisições de API
- Fallback para modo offline
- Atualização automática de cache

### Installability
A aplicação pode ser instalada em:
- Desktop (Chrome, Edge, Safari)
- Android (Chrome, Samsung Internet)
- iOS (Safari)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [OpenWeatherMap](https://openweathermap.org/) - API de dados meteorológicos
- [Lucide Icons](https://lucide.dev/) - Biblioteca de ícones
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ usando React, TypeScript e OpenWeatherMap API
