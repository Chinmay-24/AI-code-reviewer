# 🚀 AI Code Reviewer

An AI-powered code review platform for the hackathon! Get instant code reviews using **OpenRouter**, orchestrated by **n8n**, and deployed on **Vercel** and **Render**.

## Architecture

```
Next.js Frontend (Vercel)
    ↓ (Webhook)
n8n Workflow (Render)
    ↓ (API Call)
OpenRouter → AI Model (Mistral/Claude/etc)
```

## Features

✨ **Code Review Analysis**
- Detects bugs and potential issues
- Style and best practices suggestions
- Performance concerns identification
- Multi-language support (JavaScript, Python, TypeScript, Java, C++, Go, Rust, C#)

⚡ **Fast & Affordable**
- Uses free/cheap OpenRouter models (Mistral, Llama, etc.)
- Serverless architecture
- No infrastructure costs

🔧 **Easy Integration**
- Simple code submission form
- Real-time review results
- Beautiful dark UI

## Quick Start Guide

### Prerequisites

- Node.js 18+ and npm
- Git
- Free OpenRouter account (https://openrouter.ai)
- Free Vercel account (https://vercel.com)
- Free Render account (https://render.com)

### Step 1: Get OpenRouter API Key

1. Go to https://openrouter.ai and sign up
2. Get your API key from the dashboard
3. You get free credits to try out models

### Step 2: Deploy n8n on Render

1. Go to https://render.com and sign up
2. Create a new **Web Service**
3. Use this repository: https://github.com/n8n-io/n8n
4. Set environment variables:
   - `N8N_HOST=<your-render-subdomain>.onrender.com`
   - `OPENROUTER_API_KEY=<your-key>`
5. Deploy and wait 5-10 mins

### Step 3: Import Workflow in n8n

1. In n8n, click **Create New Workflow** → **Import from File**
2. Upload `n8n-workflow.json`
3. **Activate** the workflow
4. Copy the webhook URL: `https://<your-subdomain>.onrender.com/webhook/code-review`

### Step 4: Deploy Frontend on Vercel

1. Push this repo to GitHub
2. Go to https://vercel.com → **New Project**
3. Select your repo and auto-detect Next.js
4. Set environment:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL=<your-webhook-url>`
5. Deploy! 🎉

### Step 5: Local Setup (Optional)

```bash
npm install
echo 'NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-url/webhook/code-review' > .env.local
npm run dev
# Open http://localhost:3000
```

## Deployment Checklist

- [ ] OpenRouter API key obtained
- [ ] n8n deployed on Render with API key
- [ ] n8n workflow imported and activated
- [ ] Webhook URL copied
- [ ] Frontend deployed on Vercel with webhook URL
- [ ] Test code review works

## Project Structure

```
.
├── src/
│   ├── app/           # Next.js app pages
│   ├── components/    # React components
│   └── lib/           # Utilities
├── n8n-workflow.json  # Import to n8n!
├── .env.example       # Template
└── README.md
```

## Tech Stack

- Next.js 15, React 18, TypeScript, Tailwind CSS
- n8n (Workflow Orchestration)
- OpenRouter (AI API Gateway)
- Vercel (Frontend Hosting)
- Render (n8n Hosting)

## Cost: Free! 💰

- Vercel: Free tier
- Render: Free tier
- OpenRouter: Free starter credits
- Total: **$0**

## Troubleshooting

**"Webhook URL not configured"** → Check .env.local

**"Review request failed"** → Check n8n workflow logs and API key

**Slow responses** → Render free tier may spin down, just retry

**"401 from OpenRouter"** → Verify API key in n8n settings

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [n8n Docs](https://docs.n8n.io)
- [OpenRouter Docs](https://openrouter.ai/docs)

---

Built with ❤️ for hackers | Next.js + n8n + OpenRouter
