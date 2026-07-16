# Portfolio + Admin (portfolio2)

Standalone export of the public portfolio site and admin CMS.

| App | URL | Folder |
|-----|-----|--------|
| Portfolio | http://localhost:3000 | `apps/portfolio` |
| Admin CMS | http://localhost:3001 | `apps/admin` |

## What's included

```
portfolio2/
├── apps/portfolio/     # Public site, chat, PDF viewer, resume overlay
├── apps/admin/         # CMS (projects, prompts, uploads, analytics)
├── packages/ai/        # Mistral chat + RAG + embeddings
├── packages/database/  # Prisma + Neon PostgreSQL schema/seed
├── uploads/            # Shared PDFs and images
├── docker-compose.yml  # Optional local Postgres
├── package.json        # npm workspaces root
└── .env.example
```

**Not included:** legacy `frontend/` and `backend/` from the old AI chatbot repo.

## Setup

### 1. Environment

Copy env files from your original project (or create from example):

```bash
cp .env.example .env
cp .env apps/portfolio/.env
cp .env apps/admin/.env
cp .env packages/database/.env
```

Required keys: `DATABASE_URL`, `MISTRAL_API_KEY`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

### 2. Install & database

```bash
cd /Users/shritikjaiswal/Downloads/portfolio2
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run

```bash
npm run dev
```

- Portfolio: http://localhost:3000  
- Admin: http://localhost:3001  

## Export / zip

To share or back up:

```bash
cd /Users/shritikjaiswal/Downloads
zip -r portfolio2.zip portfolio2 -x "*/node_modules/*" "*/.next/*" "*/uploads/*" "*/.env"
```

Do **not** commit or zip `.env` files (API keys and DB passwords).
