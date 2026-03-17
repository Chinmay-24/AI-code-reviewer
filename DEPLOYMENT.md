# 📋 Deployment Guide - AI Code Reviewer

Complete step-by-step instructions for deploying your AI Code Reviewer hackathon project.

---

## Phase 1: Preparation (5 minutes)

### 1.1 Create Accounts (if you don't have them)

- [ ] **OpenRouter**: https://openrouter.ai (for AI models)
- [ ] **Render**: https://render.com (for n8n hosting)
- [ ] **Vercel**: https://vercel.com (for Next.js frontend)
- [ ] **GitHub**: https://github.com (to push your code)

### 1.2 Get Your OpenRouter API Key

1. Log in to https://openrouter.ai
2. Go to **Account** → **Keys**
3. Copy your API key
4. ✅ Save it somewhere safe (you'll need it in Phase 2)

---

## Phase 2: Deploy n8n on Render (10-15 minutes)

### 2.1 Create a New Render Web Service

1. Go to https://render.com and log in
2. Click **Dashboard** in the top right
3. Click **New +** → **Web Service**
4. Choose **Deploy an existing repository** and paste:
   ```
   https://github.com/n8n-io/n8n
   ```
5. Click **Connect**

### 2.2 Configure the Service

- **Name**: `ai-code-reviewer-n8n`
- **Runtime**: `Node`
- **Build Command**: (leave as default)
- **Start Command**: (leave as default)
- **Plan**: `Free`

### 2.3 Set Environment Variables

Scroll down to **Environment**:

Click **Add Environment Variable** and add:

1. **Key**: `OPENROUTER_API_KEY`  
   **Value**: (paste your OpenRouter API key from Phase 1)

2. **Key**: `N8N_HOST`  
   **Value**: `ai-code-reviewer-n8n.onrender.com`  
   (Replace `ai-code-reviewer` with your service name if different)

### 2.4 Deploy!

Click **Create Web Service**

⏳ **Wait 5-10 minutes** for n8n to build and deploy. You'll see the build logs stream in real-time.

Once it says **"Your service is live"**, continue to Phase 3.

---

## Phase 3: Import n8n Workflow (5 minutes)

### 3.1 Access Your n8n Instance

1. Go to `https://ai-code-reviewer-n8n.onrender.com` (use your actual service name)
2. Wait for it to load (it might be slow on first load)

### 3.2 Import the Workflow

1. In the top left, click **Create** → **Workflow**
2. Click **Import**
3. Click **Select File** and upload `n8n-workflow.json` from this repo
4. Click **Import**

You should see the workflow diagram with three nodes: Webhook → Call OpenRouter API → Format Response

### 3.3 Activate the Workflow

1. In the top right, click the **toggle** to turn the workflow **ON**
2. You'll see a green checkmark when it's active

### 3.4 Get Your Webhook URL

1. Click on the **Webhook** node (the first box)
2. Look for the **Webhook URL** field
3. Copy the full URL (it should be something like: `https://ai-code-reviewer-n8n.onrender.com/webhook/code-review`)
4. ✅ **Save this URL** for Phase 4!

---

## Phase 4: Deploy Frontend on Vercel (10 minutes)

### 4.1 Push Code to GitHub

From your terminal:

```bash
git init
git add .
git commit -m "Add AI Code Reviewer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git push -u origin main
```

Replace with your actual GitHub URL.

### 4.2 Deploy on Vercel

1. Go to https://vercel.com and log in
2. Click **Add New...** → **Project**
3. Select your GitHub repository
4. Click **Import**

### 4.3 Set Environment Variables

When prompted for environment variables:

- **Name**: `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- **Value**: (paste the webhook URL from Phase 3.4)

Click **Add**

### 4.4 Deploy!

Click **Deploy**

⏳ **Wait 2-3 minutes** for the build to complete.

Once you see "Congratulations! Your site is deployed", you're done! 🎉

---

## Phase 5: Test Your App (5 minutes)

### 5.1 Visit Your Live App

Click the **Visit** button on Vercel, or go to your production URL.

You should see:
- Header: "AI Code Reviewer"
- A form to select programming language
- A textarea to paste code
- A "Get Review" button

### 5.2 Test a Code Review

1. Select a programming language
2. Paste some code in the textarea
3. Click **Get Review**
4. Wait 10-30 seconds for the review to appear

Example JavaScript code to test with:

```javascript
function addNumbers(a, b) {
  var result = a + b;
  return result
}

const arr = [1,2,3,4,5];
for (var i = 0; i < arr.length; i++) {
  console.log(arr[i])
}
```

You should get a review with issues and suggestions!

---

## Phase 6: Local Development (Optional)

If you want to develop locally:

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Create .env.local with your webhook URL
echo 'NEXT_PUBLIC_N8N_WEBHOOK_URL=https://ai-code-reviewer-n8n.onrender.com/webhook/code-review' > .env.local

# Run dev server
npm run dev

# Open http://localhost:3000
```

---

## 🚨 Troubleshooting

### "n8n takes forever to load"
- Render free tier spins down after 15 minutes of inactivity
- Solution: Wait 30 seconds and refresh, or upgrade to paid plan

### "Webhook URL not configured"
- Check that `NEXT_PUBLIC_N8N_WEBHOOK_URL` is set in Vercel environment variables
- Make sure you're using the `NEXT_PUBLIC_` prefix!

### "Review request failed / 404"
- Verify the webhook URL is correct (check n8n workflow)
- Make sure the n8n workflow is **activated** (green toggle)
- Check n8n logs: Dashboard → Executions tab

### "401 Unauthorized from OpenRouter"
- Verify your API key is correct in Render environment variables
- Check that you have API credits at https://openrouter.ai/account/credits
- Make sure the variable is named exactly `OPENROUTER_API_KEY` in Render

### Build fails on Vercel
- Check the build logs in Vercel dashboard
- Make sure `.env.example` doesn't have placeholder values
- Verify you're using Node 18+

---

## 📊 Costs Breakdown

| Service       | Plan          | Cost    |
|---------------|---------------|---------|
| Vercel        | Free Tier     | $0      |
| Render        | Free Tier     | $0      |
| OpenRouter    | Free Credits  | $0*     |
| **TOTAL**     |               | **$0**  |

*OpenRouter gives free credits ($5) to new users. Paid options available if you go over.

---

## 🎯 Production Tips

1. **Monitor OpenRouter costs** at https://openrouter.ai/account/costs
2. **Add a custom domain** (Vercel supports this)
3. **Set up error tracking** (Sentry, LogRocket, etc.)
4. **Use faster models** like `mistral-7b-instruct` for better latency
5. **Cache reviews** if the same code is reviewed multiple times
6. **Rate limit** to prevent API abuse

---

## ✅ Final Checklist

- [ ] OpenRouter API key obtained
- [ ] n8n deployed and running on Render
- [ ] n8n workflow imported and activated
- [ ] Webhook URL copied and tested
- [ ] Frontend deployed on Vercel
- [ ] Environment variables set in Vercel
- [ ] Test code submission works
- [ ] No errors in browser console
- [ ] No errors in n8n logs

---

## 🚀 You're Deployed!

Congratulations! Your AI Code Reviewer is now live and ready for the hackathon! 🎉

Share your URL and challenge your friends to submit code for review!

---

**Need help?**
- Check the [README.md](./README.md) for more details
- Review the [troubleshooting section](#-troubleshooting)
- Open an issue on GitHub
