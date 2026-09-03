# Atlas500 Global Picks

AI-powered affiliate marketplace with intelligent product discovery, automated content generation, and multi-network affiliate integration.

## Architecture

- **Monorepo**: Turborepo with pnpm workspaces
- **Frontend**: Next.js 14 (App Router), React Server Components, TailwindCSS
- **Backend**: Fastify, Prisma ORM, PostgreSQL, Redis, BullMQ
- **Search**: PostgreSQL full-text + Meilisearch for semantic search
- **AI**: OpenAI/Anthropic integration for content generation
- **Affiliate**: Modular provider architecture supporting 12+ networks

## Quick Start

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start infrastructure
docker-compose -f infra/docker/docker-compose.yml up -d db redis meilisearch

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Start development
pnpm dev
```

## Project Structure

```
apps/
  web/          # Next.js frontend
  api/          # Fastify backend API
packages/
  shared/       # Types & utilities
  database/     # Prisma schema & client
  affiliate/    # Provider architecture
  ai/           # Content generation engine
```

## Affiliate Networks

| Network | Status | API |
|---------|--------|-----|
| Amazon PA API | Planned | Product Advertising API 5.0 |
| CJ Affiliate | Planned | Developer API |
| Impact | Planned | REST API |
| Awin | Planned | Publisher API |
| Rakuten | Planned | LinkShare API |
| ShareASale | Planned | Merchant API |

## License

MIT
