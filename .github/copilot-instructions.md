# AI Code Reviewer - Copilot Instructions

This Next.js project is an AI-powered code reviewer that integrates with OpenRouter and n8n.

## Project Overview

- **Frontend**: Next.js 15 with TypeScript, React 18, Tailwind CSS
- **Orchestration**: n8n (handles OpenRouter API calls)
- **AI**: OpenRouter API (Mistral, Claude, etc.)
- **Deployment**: Vercel (frontend), Render (n8n)

## Key Files

- `src/app/page.tsx` - Main landing page
- `src/components/CodeReviewer.tsx` - Code review UI component
- `src/lib/openrouter.ts` - API client for n8n webhook
- `n8n-workflow.json` - n8n workflow (import to your instance)
- `.env.example` - Environment variables template

## Setup Instructions

1. Install dependencies: `npm install`
2. Create `.env.local` file with your n8n webhook URL
3. Run dev server: `npm run dev`
4. Visit http://localhost:3000

## Environment Variables

Required:
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` - Your n8n webhook endpoint

Optional:
- `OPENROUTER_API_KEY` - If running standalone without n8n

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_N8N_WEBHOOK_URL` environment variable
4. Deploy

### n8n (Render)
1. Deploy n8n repository to Render
2. Set `OPENROUTER_API_KEY` environment variable
3. Import `n8n-workflow.json` workflow
4. Activate workflow
5. Copy webhook URL to Vercel

## Development Guidelines

- Use TypeScript for all new files
- Follow ESLint rules (run `npm run lint`)
- Use Tailwind CSS for styling (no CSS files)
- Keep components in `src/components/`
- Keep utilities in `src/lib/`

## Common Tasks

**Run development server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
npm start
```

**Lint code:**
```bash
npm run lint
```

**Add new dependencies:**
```bash
npm install <package-name>
```

## Troubleshooting

- If `.env.local` is missing, copy from `.env.example` and update values
- Remember to set `NEXT_PUBLIC_*` variables for client-side usage
- n8n webhook URL should be publicly accessible
- Check n8n logs if reviews fail
