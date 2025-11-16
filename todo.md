# Weather PWA - TODO List

## Backend API
- [x] Configurar secret OPENWEATHER_API_KEY
- [x] Criar endpoint para buscar previsão do tempo por cidade
- [x] Criar endpoint para buscar previsão do tempo por coordenadas
- [x] Criar endpoint para buscar previsão de 5 dias
- [x] Implementar cache de requisições para otimizar uso da API
- [x] Adicionar tratamento de erros e validações

## Frontend PWA
- [x] Criar interface de busca de cidade
- [x] Exibir dados de temperatura, umidade, vento e descrição do tempo
- [x] Exibir previsão de 5 dias
- [x] Implementar geolocalização para detectar cidade atual
- [x] Criar manifest.webmanifest com ícones e configurações PWA
- [x] Implementar service worker para cache offline
- [x] Adicionar ícones PWA (192x192 e 512x512)
- [x] Implementar design responsivo e moderno
- [x] Adicionar animações e transições

## Docker & Compose
- [x] Criar Dockerfile para backend (Node/Express)
- [x] Criar Dockerfile para frontend (Vite + Nginx)
- [x] Criar docker-compose.yml orquestrando web + api
- [x] Testar execução local com Docker Compose

## Testes
- [x] Configurar Playwright para testes E2E
- [x] Criar testes E2E para busca de cidade
- [x] Criar testes E2E para exibição de dados
- [x] Criar testes E2E para funcionalidade offline

## CI/CD
- [x] Criar workflow GitHub Actions para build
- [x] Adicionar testes no pipeline
- [x] Adicionar relatório Lighthouse (opcional)
- [x] Configurar upload de artefatos
- [x] Preparar deploy para GitHub Pages

## Documentação
- [x] Atualizar README.md com arquitetura
- [x] Documentar endpoints da API
- [x] Documentar como rodar com Docker Compose
- [x] Documentar processo de instalação do PWA
- [x] Adicionar screenshots e exemplos
