# WANGHAF Fantasy League

A full-stack weekly league betslip built with Next.js, React, TypeScript, and PostgreSQL.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` for your PostgreSQL database.

3. Apply the schema and seed Weeks 2–18 of the 2026 season:

   ```bash
   npm run db:setup
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Product and acceptance requirements are recorded in [`docs/requirements.md`](docs/requirements.md).
