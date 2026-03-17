# Deployment Guide: n8n + Vercel + OpenRouter

This guide walks you through deploying the AI Code Reviewer to production.

## Architecture

```
User Browser (Vercel)
    ↓
Next.js App (localhost:3001 → vercel.com)
    ↓
n8n Webhook (render.com)
    ↓
OpenRouter API
    ↓
LLM (Claude, Mistral, etc.)
```

---

## Step 1: Deploy n8n to Render

### 1.1 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub (recommended)
- Create a new project

### 1.2 Deploy n8n Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (codeeditor)
3. Configure:
   - **Name**: `ai-code-reviewer-n8n`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `n8n start`
   - **Plan**: Free (or Starter for production)
   - **Environment Variables** (add these):
     ```
     OPENROUTER_API_KEY=your_openrouter_key_here
     N8N_ENCRYPTION_KEY=your_random_secret_key_here
     ```

4. Deploy (takes ~5 minutes)
5. Copy your Render URL: `https://your-service.onrender.com`

### 1.3 Import n8n Workflow
1. Go to your deployed n8n instance
2. Click **"Workflows"** → **"Import from file"**
3. Upload `n8n-workflow.json` from your repo
4. Click **"Save"** and **"Activate"**
5. Copy the webhook URL:
   ```
   https://your-service.onrender.com/webhook/code-review
   ```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub
- Authorize Vercel to access your repositories

### 2.2 Deploy Next.js App
1. Click **"New Project"**
2. Import your `codeeditor` repository
3. Framework preset should auto-select: **Next.js**
4. Configure Environment Variables:
   ```
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-service.onrender.com/webhook/code-review
   ```
   (Paste the webhook URL from Step 1.3)

5. Click **"Deploy"** (takes ~3 minutes)
6. Your app is now live at: `https://your-project.vercel.app`

### 2.3 Configure Custom Domain (Optional)
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as shown by Vercel

---

## Step 3: Test Production Deployment

### 3.1 Test the Webhook Connection
1. Go to your Vercel app: `https://your-project.vercel.app`
2. Paste some code in the textarea
3. Click **"Review Code"**
4. Monitor n8n logs at: `https://your-service.onrender.com/logs`

### 3.2 Check n8n Workflow Logs
1. Go to n8n → **Workflows** → **"AI Code Review Webhook"**
2. Click **"Executions"**
3. View successful/failed requests
4. Debug any issues in the workflow

---

## Step 4: Production Checklist

- [ ] n8n service deployed on Render
- [ ] Workflow imported and activated
- [ ] OPENROUTER_API_KEY set in Render
- [ ] Frontend deployed on Vercel
- [ ] N8N_WEBHOOK_URL set in Vercel
- [ ] Test code review works end-to-end
- [ ] Monitor logs for errors
- [ ] Set up error notifications (optional)

---

## Troubleshooting

### "OpenRouter error: mistral-7b-instruct is not a valid model ID"
- **Solution**: We already fixed this! The workflow uses `openrouter/auto` now.

### "Webhook timeout"
- **Cause**: OpenRouter API is slow or unreachable
- **Solution**: Increase n8n webhook timeout in workflow settings to 30s

### "NEXT_PUBLIC_N8N_WEBHOOK_URL is undefined"
- **Cause**: Environment variable not set in Vercel
- **Solution**: Go to Vercel → Project Settings → Environment Variables → Add `NEXT_PUBLIC_N8N_WEBHOOK_URL`

### "n8n service won't start"
- **Cause**: Missing OPENROUTER_API_KEY
- **Solution**: Add it in Render → Environment Variables

---

## Environment Variables Reference

### Render (n8n)
```
OPENROUTER_API_KEY=sk-or-... (your OpenRouter API key)
N8N_ENCRYPTION_KEY=very_long_random_string_here
```

### Vercel (Next.js)
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-service.onrender.com/webhook/code-review
```

---

## Local Development

Continue using localhost:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Check if n8n webhook is reachable
curl https://your-service.onrender.com/webhook/code-review
```

---

## Monitoring & Logs

- **n8n Logs**: `https://your-service.onrender.com/logs`
- **Vercel Logs**: Vercel Dashboard → Select Project → "Logs"
- **OpenRouter Usage**: [console.openrouter.io](https://console.openrouter.io)

---

## Cost Estimates

- **Render**: Free tier (with limitations) or $7/month for Starter
- **Vercel**: Free tier included, Pro at $20/month
- **OpenRouter**: Pay-as-you-go (Claude $8/M tokens, Mistral $0.14/M tokens)

---

## Next Steps

1. Follow Step 1-4 above for initial deployment
2. Monitor logs and test thoroughly
3. Share your production URL: `https://your-project.vercel.app`
4. Celebrate! 🎉

---

## Support

- n8n Docs: [n8n.io/docs](https://n8n.io/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- OpenRouter Docs: [openrouter.ai/docs](https://openrouter.ai/docs)
