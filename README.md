# alainmwadzua Backend API

> Backend API for **alainmwadzua** — Online Class Writers built with Express.js, Prisma, and PostgreSQL.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd alainmwadzua-backend

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.dev .env
# Edit .env with your credentials

# 4. Generate Prisma Client
pnpm run prisma:generate

# 5. Run database migrations
pnpm run prisma:migrate

# 6. Seed the database
pnpm run seeds:admin      # Create admin account
pnpm run seeds:package    # Create subscription packages

# 7. Start development server
pnpm run dev
```

Server runs at `http://localhost:5000/api/v1`

---

