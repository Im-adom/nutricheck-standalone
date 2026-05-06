# NutriCheck - Quick Start (3 Steps)

## Step 1️⃣: Get Groq API Key (2 minutes)

1. Visit: https://console.groq.com
2. Click "Sign Up" → Create account
3. Go to "API Keys" 
4. Click "Create New API Key"
5. Copy the key

## Step 2️⃣: Setup Project (1 minute)

```bash
# Clone/Extract and navigate to folder
cd nutricheck-main

# Copy environment template
cp .env.example .env

# Open .env and paste your API key
# Add this line (replace with your actual key):
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

## Step 3️⃣: Run It (instant)

```bash
# Install dependencies (first time only)
npm install

# Start the app
npm start

# Open browser: http://localhost:3000
# Done! 🎉
```

## 📝 Test It

Try these claims:
- "Greek yogurt is better for weight loss"
- "Fiber is good for digestion"
- "Eggs are bad for your heart"

## 🆘 Issue?

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` |
| "GROQ_API_KEY undefined" | Add key to `.env` file |
| "Port 3000 in use" | Change to `PORT=3001` in `.env` |
| "All claims say MISLEADING" | Restart server (Ctrl+C, then `npm start`) |

## 📚 More Info

- Full setup guide: `SETUP_GUIDE.md`
- Bug fix details: `BUGFIX_SUMMARY.md`
- Original README: `README.md`

---

**That's it! Happy fact-checking!** 🥗✅
